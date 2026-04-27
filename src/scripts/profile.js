// src/scripts/profile.js

import { supabase } from "../lib/supabase.ts";

let user = null;
let profile = {};
let links = {};
let avatarFile = null;

const fields = [
  ["spotify", "Spotify"],
  ["apple", "Apple Music"],
  ["youtube", "YouTube"],
  ["soundcloud", "SoundCloud"],
  ["instagram", "Instagram"],
  ["tiktok", "TikTok"]
];

function el(id) {
  return document.getElementById(id);
}

function setAvatar(src) {
  if (!src) return;

  el("avatarPreview").src = src;
  el("liveAvatar").src = src;
}

function normalizeLinks() {
  fields.forEach(([key]) => {
    if (!links[key]) {
      links[key] = {
        url: "",
        enabled: false
      };
    }

    if (typeof links[key] === "string") {
      links[key] = {
        url: links[key],
        enabled: false
      };
    }
  });
}

function renderLinks() {
  const box = el("linksContainer");

  box.innerHTML = "";

  fields.forEach(([key, label]) => {
    const item = links[key];

    box.innerHTML += `
      <div class="rounded-2xl bg-black/30 border border-white/10 p-4">

        <div class="flex items-center justify-between mb-3">

          <span class="text-sm text-zinc-300">
            ${label}
          </span>

          <input
            type="checkbox"
            data-toggle="${key}"
            ${item.enabled ? "checked" : ""}
          />

        </div>

        <input
          type="text"
          data-input="${key}"
          value="${item.url}"
          placeholder="https://..."
          ${item.enabled ? "" : "disabled"}
          class="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-white disabled:opacity-40"
        />

      </div>
    `;
  });
}

function refreshPreview() {
  el("liveName").textContent =
    el("artist_name").value ||
    "Tu nombre artístico";

  el("liveBio").textContent =
    el("bio").value ||
    "Tu bio aparecerá aquí.";

  el("liveUrl").textContent =
    "artisthub.com/" +
    (profile.username || "username");

  const wrap = el("liveLinks");

  wrap.innerHTML = "";

  Object.entries(links).forEach(([key, val]) => {
    if (val.enabled && val.url) {
      wrap.innerHTML += `
        <a
          href="${val.url}"
          target="_blank"
          class="h-11 rounded-2xl bg-white text-black font-medium flex items-center justify-center"
        >
          ${key}
        </a>
      `;
    }
  });
}

function bindEvents() {
  // Avatar button
  el("avatarBtn").onclick = () => {
    el("avatar").click();
  };

  // Avatar input
  el("avatar").onchange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    avatarFile = file;

    const url =
      URL.createObjectURL(file);

    setAvatar(url);
  };

  // Inputs
  el("artist_name").oninput =
    refreshPreview;

  el("bio").oninput =
    refreshPreview;

  // Links text
  el("linksContainer").oninput = (e) => {
    const key =
      e.target.dataset.input;

    if (!key) return;

    links[key].url =
      e.target.value;

    refreshPreview();
  };

  // Links toggle
  el("linksContainer").onchange = (e) => {
    const key =
      e.target.dataset.toggle;

    if (!key) return;

    links[key].enabled =
      e.target.checked;

    renderLinks();
    bindEvents();
    refreshPreview();
  };

  // Save
  el("profileForm").onsubmit =
    saveProfile;
}

async function loadProfile() {
  const {
    data: { user: authUser }
  } =
    await supabase.auth.getUser();

  if (!authUser) {
    location.href = "/";
    return;
  }

  user = authUser;

  const { data } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  profile = data || {};
  links = profile.links || {};

  normalizeLinks();

  el("artist_name").value =
    profile.artist_name || "";

  el("bio").value =
    profile.bio || "";

  el("usernameText").textContent =
    profile.username ||
    "username";

  if (profile.avatar_url) {
    setAvatar(profile.avatar_url);
  }

  renderLinks();
  refreshPreview();
}

async function saveProfile(e) {
  e.preventDefault();

  const status = el("status");

  status.textContent =
    "Guardando...";

  let avatar_url =
    profile.avatar_url || "";

  // Upload avatar
if (avatarFile) {
  const ext =
    avatarFile.name.split(".").pop();

  const path =
    `${user.id}/avatar.${ext}`;

  const { error: uploadError } =
    await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, {
        upsert: true
      });

  if (uploadError) {
    console.error(uploadError);
    status.textContent =
      "❌ Error subiendo imagen";
    return;
  }

  const { data } =
    supabase.storage
      .from("avatars")
      .getPublicUrl(path);

  avatar_url = data.publicUrl + "?t=" + Date.now();

  setAvatar(avatar_url);
}

  const payload = {
    artist_name:
      el("artist_name").value,
    bio:
      el("bio").value,
    avatar_url,
    links
  };

  const { error } =
    await supabase
      .from("profiles")
      .update(payload)
      .eq("id", user.id);

  if (error) {
    status.textContent =
      "❌ Error guardando";
    return;
  }

  profile = {
    ...profile,
    ...payload
  };

  status.textContent =
    "✔ Guardado correctamente";

  refreshPreview();
}

async function init() {
  await loadProfile();
  bindEvents();
}

init();

document.addEventListener(
  "astro:page-load",
  init
);