#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
收集在 GitHub Release 中发布 `.hap`（HarmonyOS 应用包）附件的开源项目。

流水线：
  1. 发现候选仓库：手工种子（seeds.json）+ GitHub 搜索 API + 公共 Release 事件。
  2. 逐个检查候选仓库的最近 Release，寻找带 `.hap` 附件的 Release。
  3. 将命中的项目写入 data/projects.json，检查状态写入 data/state.json。
  4. 在 README.md 的 HAP_TABLE 标记之间重新生成导航表格（按发布时间倒序）。

唯一依赖：requests（见 requirements.txt）。
认证：环境变量 GITHUB_TOKEN（强烈建议设置，CI 中自动可用）。
"""

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

API_BASE = "https://api.github.com"

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SEEDS_FILE = DATA_DIR / "seeds.json"
STATE_FILE = DATA_DIR / "state.json"
PROJECTS_FILE = DATA_DIR / "projects.json"
README_FILE = ROOT / "README.md"

SEARCH_QUERIES = [
    "topic:harmonyos",
    "topic:openharmony",
    "harmonyos in:name,description",
    "openharmony in:name,description",
    "hap in:name,description",
]

SEARCH_PAGE_SIZE = 100
SEARCH_MAX_PAGES = 10
SEARCH_PACING_SECONDS = 3  # 搜索 API 每次请求之间至少间隔 3 秒（限速 30 次/分钟）
RELEASES_PER_PAGE = 10
EVENTS_PER_PAGE = 100
PROCESSED_EVENT_IDS_LIMIT = 2000  # 只保留最近的事件 id，防止列表无限膨胀

TABLE_START = "<!-- HAP_TABLE_START -->"
TABLE_END = "<!-- HAP_TABLE_END -->"

TOKEN = os.environ.get("GITHUB_TOKEN", "").strip()


def now_iso():
    """当前 UTC 时间的 ISO8601 字符串。"""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def load_json(path, default):
    """读取 JSON 文件，文件缺失或损坏时返回默认值。"""
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return default


def save_json(path, data):
    """以 UTF-8 写入 JSON 文件。"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def api_get(url, params=None, etag=None):
    """GitHub API GET 请求封装。

    返回 (json_data, new_etag, changed)：
      - 304 Not Modified -> (None, etag, False)，不消耗配额
      - 403 速率限制     -> 等待 X-RateLimit-Reset（或 Retry-After）后重试
      - 其他非 2xx      -> 抛出 HTTPError
      - 成功            -> (json, ETag 头, True)
    """
    headers = {
        "Accept": "application/vnd.github+json",
    }
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    if etag:
        headers["If-None-Match"] = etag

    while True:
        resp = requests.get(url, params=params, headers=headers, timeout=30)

        if resp.status_code == 304:
            return None, etag, False

        if resp.status_code == 403:
            wait = 0
            reset = resp.headers.get("X-RateLimit-Reset")
            if reset:
                try:
                    wait = int(reset) - time.time() + 1
                except ValueError:
                    wait = 0
            if wait > 0:
                print(f"[rate-limit] sleeping {wait:.0f}s until reset")
                time.sleep(wait)
                continue
            retry_after = resp.headers.get("Retry-After")
            if retry_after:
                try:
                    delay = int(retry_after)
                except ValueError:
                    delay = 60
                print(f"[rate-limit] retrying after {delay}s")
                time.sleep(delay)
                continue
            resp.raise_for_status()

        if not resp.ok:
            resp.raise_for_status()

        return resp.json(), resp.headers.get("ETag"), True


def discover_release_events(state):
    """从公共事件流中发现新发布的 ReleaseEvent，并记录已处理事件 id。

    返回去重后的候选仓库集合（full_name）。
    """
    data, _, _ = api_get(f"{API_BASE}/events", params={"per_page": EVENTS_PER_PAGE})
    processed = set(state["processed_event_ids"])
    candidates = set()
    new_ids = []
    for event in data or []:
        eid = event.get("id")
        if eid is None:
            continue
        if eid in processed:
            continue
        new_ids.append(eid)
        if (
            event.get("type") == "ReleaseEvent"
            and (event.get("payload") or {}).get("action") == "published"
        ):
            repo = event.get("repo") or {}
            if repo.get("name"):
                candidates.add(repo["name"])
    if new_ids:
        # 事件流按最新在前返回，保留最近的部分即可
        state["processed_event_ids"] = (
            state["processed_event_ids"] + new_ids
        )[-PROCESSED_EVENT_IDS_LIMIT:]
    return candidates


def discover_candidates(state):
    """合并 seeds + 搜索结果 + Release 事件，得到去重的候选仓库集合。"""
    candidates = set()

    # 1. 手工种子仓库
    seeds = load_json(SEEDS_FILE, [])
    if isinstance(seeds, list):
        for name in seeds:
            if isinstance(name, str) and name.strip() and "/" in name:
                candidates.add(name.strip())
    print(f"[discover] {len(candidates)} candidates from seeds")

    # 2. GitHub 搜索（每次请求至少间隔 3 秒，页数不足 100 提前结束）
    first_request = True
    for query in SEARCH_QUERIES:
        for page in range(1, SEARCH_MAX_PAGES + 1):
            if not first_request:
                time.sleep(SEARCH_PACING_SECONDS)
            first_request = False
            data, _, _ = api_get(
                f"{API_BASE}/search/repositories",
                params={"q": query, "per_page": SEARCH_PAGE_SIZE, "page": page},
            )
            items = (data or {}).get("items") or []
            for item in items:
                full_name = item.get("full_name")
                if full_name:
                    candidates.add(full_name)
            print(f"[search] q='{query}' page={page} -> {len(items)} repos")
            if len(items) < SEARCH_PAGE_SIZE:
                break

    # 3. 公共 Release 事件
    event_candidates = discover_release_events(state)
    candidates |= event_candidates
    print(f"[events] {len(event_candidates)} new release events")

    return candidates


def inspect_releases(full_name, releases):
    """在 Release 列表中找到最新（按发布时间）带 `.hap` 附件的 Release。

    返回 (project_or_None, has_hap)。
    """
    ordered = sorted(
        releases or [],
        key=lambda r: (r.get("published_at") or ""),
        reverse=True,
    )
    for release in ordered:
        if release.get("draft"):
            continue
        hap_assets = [
            a
            for a in (release.get("assets") or [])
            if (a.get("name") or "").lower().endswith(".hap")
        ]
        if not hap_assets:
            continue

        # 命中：拉取仓库基本信息
        info, _, _ = api_get(f"{API_BASE}/repos/{full_name}")
        project = {
            "full_name": full_name,
            "html_url": info.get("html_url") or f"https://github.com/{full_name}",
            "description": info.get("description") or "",
            "stars": info.get("stargazers_count") or 0,
            "latest_hap_release": {
                "tag_name": release.get("tag_name") or "",
                "published_at": release.get("published_at") or "",
                "html_url": release.get("html_url") or "",
                "assets": [
                    {
                        "name": a.get("name"),
                        "browser_download_url": a.get("browser_download_url"),
                        "size": a.get("size"),
                    }
                    for a in hap_assets
                ],
            },
        }
        return project, True

    return None, False


def build_table(projects):
    """生成 README 表格内容（按最新 HAP Release 发布时间降序）。"""
    ordered = sorted(
        projects,
        key=lambda p: (p.get("latest_hap_release") or {}).get("published_at") or "",
        reverse=True,
    )
    rows = [
        "<!-- 自动生成，请勿手动编辑 -->",
        "| 项目 | 简介 | Stars | 最新版本 | 更新日期 | HAP 下载 |",
        "|------|------|------|---------|---------|----------|",
    ]
    for p in ordered:
        name = p.get("full_name", "")
        repo_url = p.get("html_url") or f"https://github.com/{name}"
        desc = (
            (p.get("description") or "")
            .replace("\r", " ")
            .replace("\n", " ")[:60]
            .replace("|", "\\|")
        )
        stars = p.get("stars", 0)
        rel = p.get("latest_hap_release") or {}
        tag = rel.get("tag_name") or ""
        rel_url = rel.get("html_url") or ""
        published = rel.get("published_at") or ""
        date = published[:10]  # YYYY-MM-DD
        assets = rel.get("assets") or []
        downloads = "<br>".join(
            f"[{a.get('name', '')}]({a.get('browser_download_url', '')})" for a in assets
        )
        rows.append(
            f"| [{name}]({repo_url}) | {desc} | {stars} | [{tag}]({rel_url}) | {date} | {downloads} |"
        )
    return "\n".join(rows)


def update_readme(table):
    """用新表格替换 README 中 HAP_TABLE 标记之间的内容。返回是否有变更。"""
    if not README_FILE.exists():
        print(f"[readme] {README_FILE} not found, skipping")
        return False
    content = README_FILE.read_text(encoding="utf-8")
    if TABLE_START not in content or TABLE_END not in content:
        print("[readme] markers not found, skipping")
        return False
    head, _, rest = content.partition(TABLE_START)
    _, _, tail = rest.partition(TABLE_END)
    new_content = head + TABLE_START + "\n" + table + "\n" + TABLE_END + tail
    if new_content != content:
        README_FILE.write_text(new_content, encoding="utf-8")
        return True
    return False


def main():
    if not TOKEN:
        print("[warn] GITHUB_TOKEN is not set; API rate limits will be much lower")

    # 读取状态与既有项目
    state = load_json(STATE_FILE, {"candidates": {}, "processed_event_ids": []})
    state.setdefault("candidates", {})
    state.setdefault("processed_event_ids", [])

    projects = load_json(PROJECTS_FILE, [])
    if not isinstance(projects, list):
        projects = []
    projects_map = {
        p["full_name"]: p for p in projects if isinstance(p, dict) and p.get("full_name")
    }

    candidates = discover_candidates(state)
    print(f"[discover] {len(candidates)} unique candidates")

    found = {}
    no_hap = set()
    skipped = 0
    for name in sorted(candidates):
        cand = state["candidates"].setdefault(name, {})
        try:
            # 已确认有 hap 且 ETag 未变化 -> 跳过，节省配额
            if cand.get("has_hap") and cand.get("etag"):
                releases, etag, changed = api_get(
                    f"{API_BASE}/repos/{name}/releases",
                    params={"per_page": RELEASES_PER_PAGE},
                    etag=cand["etag"],
                )
                cand["last_checked_at"] = now_iso()
                if not changed:
                    skipped += 1
                    continue
                cand["etag"] = etag
            else:
                releases, etag, _ = api_get(
                    f"{API_BASE}/repos/{name}/releases",
                    params={"per_page": RELEASES_PER_PAGE},
                )
                cand["etag"] = etag
                cand["last_checked_at"] = now_iso()
        except requests.exceptions.HTTPError as exc:
            # 搜索/种子中混入已删除或已改名的仓库，跳过而非中断
            status = exc.response.status_code if exc.response is not None else None
            if status == 404:
                print(f"[skip] {name} not found (404)")
                cand["last_checked_at"] = now_iso()
                continue
            raise

        project, has_hap = inspect_releases(name, releases)
        cand["has_hap"] = bool(has_hap)  # 记录检查结论，供后续 ETag 跳过判断使用
        if has_hap and project:
            found[name] = project
        else:
            no_hap.add(name)
        print(f"[check] {name}: has_hap={has_hap}")

    # 合并：保留既有项目并更新；仅当本轮明确复查确认无 hap 时才移除
    for name in no_hap:
        projects_map.pop(name, None)
    projects_map.update(found)
    final = sorted(
        projects_map.values(),
        key=lambda p: (p.get("latest_hap_release") or {}).get("published_at") or "",
        reverse=True,
    )

    save_json(PROJECTS_FILE, final)
    save_json(STATE_FILE, state)

    table = build_table(final)
    readme_changed = update_readme(table)
    print(
        f"[done] candidates={len(candidates)} skipped_unchanged={skipped} "
        f"projects={len(final)} readme_changed={readme_changed}"
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # CI 日志可见的错误出口
        print(f"[fatal] {type(exc).__name__}: {exc}", file=sys.stderr)
        sys.exit(1)
