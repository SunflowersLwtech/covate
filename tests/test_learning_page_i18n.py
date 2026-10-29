"""The quiz page speaks the language the user picked, and shows Covate's own icon.

The local quiz page (static/learning/test.html) is translated in the browser:
js/modules/i18n.js replaces the text of every element marked ``data-i18n``, the
tooltip of every ``data-i18n-title`` and the copy hint of every
``data-i18n-copy-hint`` with the value from locales/<lang>.json. Text written into
the page without one of those marks stays English after the user picks 简中 or 繁中,
and a Chinese catalog value that is still English shows English all the same. These
tests read the repo files, not a browser, so they run with the rest of the suite.
"""

import hashlib
import json
import re
import struct
from html.parser import HTMLParser
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
PAGE_DIR = ROOT / "src" / "covate" / "web" / "static" / "learning"
LOCALES = ("en", "zh-CN", "zh-TW")

HAN = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]")
LATIN_WORD = re.compile(r"[A-Za-z]{2,}")

# covate.org's mark (assets/favicon.png, the README logo) scaled to 64×64 — the same
# pixels as the 64px frame of platform/app/favicon.ico. Regenerate it from that file
# and update this hash together; a placeholder or another product's logo fails here.
FAVICON_SHA256 = "4f1786660be10268cdb9f34bc9f23f91b768c9c9023d33f27a1f04a1352ffa8c"


def _flatten(value, prefix=""):
    if isinstance(value, dict):
        for key, child in value.items():
            yield from _flatten(child, f"{prefix}.{key}" if prefix else key)
    else:
        yield prefix, value


@pytest.fixture(scope="module")
def catalogs():
    return {
        lang: dict(_flatten(json.loads((PAGE_DIR / "locales" / f"{lang}.json").read_text(encoding="utf-8"))))
        for lang in LOCALES
    }


class _Page(HTMLParser):
    """Collects each element's attributes and the text directly inside it."""

    VOID = {"meta", "link", "br", "img", "input", "path", "polyline", "line", "circle", "rect"}

    def __init__(self):
        super().__init__()
        self.stack: list[tuple[str, dict]] = []
        self.elements: list[tuple[str, dict]] = []
        self.texts: list[tuple[str, dict, str]] = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if tag not in self.VOID:
            self.stack.append((tag, attrs))

    def handle_endtag(self, tag):
        while self.stack and self.stack[-1][0] != tag:
            self.stack.pop()
        if self.stack:
            self.stack.pop()

    def handle_data(self, data):
        if data.strip() and self.stack and self.stack[-1][0] not in ("script", "style"):
            tag, attrs = self.stack[-1]
            self.texts.append((tag, attrs, data.strip()))


@pytest.fixture(scope="module")
def page():
    parser = _Page()
    parser.feed((PAGE_DIR / "test.html").read_text(encoding="utf-8"))
    return parser


def test_locales_have_the_same_keys(catalogs):
    """A key missing in one language falls back to English (or prints the key)."""
    en = set(catalogs["en"])
    for lang in LOCALES[1:]:
        assert set(catalogs[lang]) == en, f"{lang}.json keys differ from en.json"


@pytest.mark.parametrize("lang", ["zh-CN", "zh-TW"])
def test_chinese_catalog_holds_chinese(catalogs, lang):
    """A Chinese value with no Chinese in it, or mostly English words, is untranslated."""
    english = []
    for key, value in catalogs[lang].items():
        words, han = len(LATIN_WORD.findall(value)), len(HAN.findall(value))
        if (words and not han) or (words >= 4 and words > han):
            english.append(f"{key}: {value!r}")
    assert not english, f"{lang}.json values still in English:\n" + "\n".join(english)


def test_english_catalog_holds_no_chinese(catalogs):
    chinese = [f"{key}: {value!r}" for key, value in catalogs["en"].items() if HAN.search(value)]
    assert not chinese, "en.json values with Chinese in them:\n" + "\n".join(chinese)


def test_every_visible_text_has_a_translation_key(page, catalogs):
    """Text in the page must be marked data-i18n, and match its English value, so
    the page reads the same before and after the script runs. The language
    switcher's own option labels (EN, 简中, 繁中) are the one exception."""
    unmarked, drifted = [], []
    for tag, attrs, text in page.texts:
        if tag == "title" or (tag == "option" and attrs.get("value") in LOCALES):
            continue
        key = attrs.get("data-i18n")
        if not key:
            unmarked.append(f"<{tag}> {text!r}")
        elif catalogs["en"].get(key) != text:
            drifted.append(f"<{tag} data-i18n={key!r}> {text!r} ≠ en.json {catalogs['en'].get(key)!r}")
    assert not unmarked, "visible text without data-i18n:\n" + "\n".join(unmarked)
    assert not drifted, "page text differs from its English catalog value:\n" + "\n".join(drifted)


def test_every_tooltip_and_copy_hint_has_a_translation_key(page):
    missing = []
    for tag, attrs in page.elements:
        if "title" in attrs and "data-i18n-title" not in attrs:
            missing.append(f"<{tag} title={attrs['title']!r}> has no data-i18n-title")
        if "data-copy-hint" in attrs and "data-i18n-copy-hint" not in attrs:
            missing.append(f"<{tag} data-copy-hint={attrs['data-copy-hint']!r}> has no data-i18n-copy-hint")
    assert not missing, "\n".join(missing)


def test_every_key_the_page_uses_exists_in_every_language(page, catalogs):
    keys = {
        attrs[name]
        for _, attrs in page.elements
        for name in ("data-i18n", "data-i18n-title", "data-i18n-copy-hint")
        if name in attrs
    }
    assert keys, "the page marks no element for translation — the parser is broken, not the page"
    for lang in LOCALES:
        missing = sorted(keys - set(catalogs[lang]))
        assert not missing, f"{lang}.json lacks keys the page uses: {missing}"


def test_page_title_matches_the_english_app_title(page, catalogs):
    """i18n.js sets document.title from app.title; the static title is what shows first."""
    titles = [text for tag, _, text in page.texts if tag == "title"]
    assert titles == [catalogs["en"]["app.title"]]


def test_favicon_is_covates_own_small_png(page):
    icons = [attrs.get("href") for tag, attrs in page.elements if tag == "link" and attrs.get("rel") == "icon"]
    assert icons == ["/static/favicon.png"]
    data = (PAGE_DIR / "favicon.png").read_bytes()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "favicon.png is not a PNG file"
    width, height = struct.unpack(">II", data[16:24])
    assert (width, height) == (64, 64)
    assert hashlib.sha256(data).hexdigest() == FAVICON_SHA256, "favicon.png is not covate.org's mark"
