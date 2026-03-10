// Lightweight admin state. We intentionally keep this minimal to
// make the dashboard easy to read and extend for a solo developer.
let adminState = {
  products: [],
  selectedId: null,
  dragId: null,
  mfaPending: false
};

// Small helper around fetch that always sends/receives JSON and
// surfaces server errors as Error instances.
function adminApi(path, options) {
  const headers = options && options.headers ? { ...options.headers } : {};
  headers["Content-Type"] = "application/json";
  const opts = {
    method: options && options.method ? options.method : "GET",
    headers
  };
  if (options && options.body) {
    opts.body = JSON.stringify(options.body);
  }
  return fetch(path, opts).then(r => {
    if (!r.ok) {
      return r.json().catch(() => ({})).then(err => {
        const message = err && err.error ? err.error : "Request failed";
        throw new Error(message);
      });
    }
    return r.json();
  });
}

function adminSetMessage(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text || "";
  }
}

function adminRenderProducts() {
  const list = document.getElementById("admin-products-list");
  if (!list) return;
  list.innerHTML = "";
  if (!adminState.products.length) {
    const empty = document.createElement("div");
    empty.textContent = "No products found.";
    empty.style.padding = "8px 10px";
    list.appendChild(empty);
    return;
  }
  adminState.products.forEach(p => {
    const row = document.createElement("div");
    row.className = "admin-product-row";
    row.dataset.id = String(p.id);
    row.draggable = true;
    const left = document.createElement("div");
    left.innerHTML = `<div>${p.name}</div><div class="admin-product-meta">₹${p.price} · Stock ${p.inventory} ${p.archived ? "· Archived" : ""}</div>`;
    const right = document.createElement("div");
    const pill = document.createElement("span");
    pill.className = "admin-pill";
    pill.textContent = "#" + p.sort_order;
    right.appendChild(pill);
    row.appendChild(left);
    row.appendChild(right);
    row.addEventListener("click", e => {
      if (adminState.dragId !== null) return;
      adminSelectProduct(p.id);
    });
    row.addEventListener("dragstart", e => {
      adminState.dragId = p.id;
      row.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });
    row.addEventListener("dragend", () => {
      adminState.dragId = null;
      row.classList.remove("dragging");
    });
    row.addEventListener("dragover", e => {
      e.preventDefault();
      const currentId = p.id;
      if (!adminState.dragId || adminState.dragId === currentId) return;
      const currentIndex = adminState.products.findIndex(x => x.id === currentId);
      const dragIndex = adminState.products.findIndex(x => x.id === adminState.dragId);
      if (currentIndex === -1 || dragIndex === -1) return;
      const copy = adminState.products.slice();
      const [dragItem] = copy.splice(dragIndex, 1);
      copy.splice(currentIndex, 0, dragItem);
      adminState.products = copy.map((item, index) => ({ ...item, sort_order: index }));
      adminRenderProducts();
    });
    list.appendChild(row);
  });
}

function adminRenderPreview() {
  const preview = document.getElementById("admin-preview");
  if (!preview) return;
  const id = adminState.selectedId;
  const product = adminState.products.find(p => p.id === id);
  const name = product ? product.name : document.getElementById("admin-name").value;
  const description = product ? product.description : document.getElementById("admin-description").value;
  const price = product ? product.price : parseInt(document.getElementById("admin-price").value || "0", 10) || 0;
  const imageUrl = product ? product.image_url : document.getElementById("admin-image-url").value;
  const archived = product ? product.archived : parseInt(document.getElementById("admin-archived").value || "0", 10) || 0;
  preview.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "product-card";
  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = name || "";
    wrapper.appendChild(img);
  }
  const title = document.createElement("h3");
  title.textContent = name || "Product name";
  wrapper.appendChild(title);
  const priceDiv = document.createElement("div");
  priceDiv.className = "product-price";
  priceDiv.textContent = price ? "₹" + price : "Price";
  wrapper.appendChild(priceDiv);
  const descP = document.createElement("p");
  descP.textContent = description || "Description";
  wrapper.appendChild(descP);
  const statusSpan = document.createElement("div");
  statusSpan.className = "admin-pill";
  statusSpan.textContent = archived ? "Archived" : "Active";
  wrapper.appendChild(statusSpan);
  preview.appendChild(wrapper);
}

function adminFillForm(product) {
  const idEl = document.getElementById("admin-product-id");
  const nameEl = document.getElementById("admin-name");
  const descEl = document.getElementById("admin-description");
  const priceEl = document.getElementById("admin-price");
  const invEl = document.getElementById("admin-inventory");
  const imgEl = document.getElementById("admin-image-url");
  const archEl = document.getElementById("admin-archived");
  if (!product) {
    if (idEl) idEl.value = "";
    if (nameEl) nameEl.value = "";
    if (descEl) descEl.value = "";
    if (priceEl) priceEl.value = "";
    if (invEl) invEl.value = "";
    if (imgEl) imgEl.value = "";
    if (archEl) archEl.value = "0";
  } else {
    if (idEl) idEl.value = String(product.id);
    if (nameEl) nameEl.value = product.name;
    if (descEl) descEl.value = product.description;
    if (priceEl) priceEl.value = String(product.price);
    if (invEl) invEl.value = String(product.inventory);
    if (imgEl) imgEl.value = product.image_url || "";
    if (archEl) archEl.value = String(product.archived || 0);
  }
  adminRenderPreview();
}

function adminSelectProduct(id) {
  adminState.selectedId = id;
  const product = adminState.products.find(p => p.id === id);
  adminFillForm(product || null);
  adminLoadActivity();
}

function adminLoadProducts(searchQuery) {
  const params = new URLSearchParams();
  if (searchQuery) {
    params.set("q", searchQuery);
  }
  return adminApi("/admin/api/products?" + params.toString(), {
    method: "GET"
  }).then(data => {
    adminState.products = data.products || [];
    adminRenderProducts();
    if (adminState.products.length) {
      adminSelectProduct(adminState.products[0].id);
    } else {
      adminFillForm(null);
    }
  });
}

function adminLoadActivity() {
  const list = document.getElementById("admin-activity-list");
  if (!list) return;
  adminApi("/admin/api/activity", { method: "GET" })
    .then(data => {
      const activity = data.activity || [];
      list.innerHTML = "";
      activity.forEach(entry => {
        const div = document.createElement("div");
        div.className = "admin-log-entry";
        const when = entry.created_at || "";
        const action = entry.action || "";
        const email = entry.user_email || "";
        div.textContent = when + " · " + action + " · " + email;
        list.appendChild(div);
      });
    })
    .catch(() => {
      list.textContent = "Unable to load activity.";
    });
}

function adminSaveProduct() {
  const idVal = document.getElementById("admin-product-id").value;
  const name = document.getElementById("admin-name").value.trim();
  const description = document.getElementById("admin-description").value.trim();
  const price = parseInt(document.getElementById("admin-price").value || "0", 10);
  const inventory = parseInt(document.getElementById("admin-inventory").value || "0", 10);
  const imageUrl = document.getElementById("admin-image-url").value.trim();
  const archived = parseInt(document.getElementById("admin-archived").value || "0", 10);
  if (!name || !description || Number.isNaN(price) || Number.isNaN(inventory)) {
    adminSetMessage("admin-form-message", "Name, description, price, and inventory are required.");
    return;
  }
  const payload = {
    name,
    description,
    price,
    image_url: imageUrl,
    inventory,
    archived
  };
  const isNew = !idVal;
  const path = isNew ? "/admin/api/products" : "/admin/api/products/" + idVal;
  const method = isNew ? "POST" : "PUT";
  adminApi(path, { method, body: payload })
    .then(data => {
      adminSetMessage("admin-form-message", "Saved.");
      if (isNew) {
        adminLoadProducts(document.getElementById("admin-search-input").value.trim());
      } else {
        const updated = data.product;
        const index = adminState.products.findIndex(p => p.id === updated.id);
        if (index !== -1) {
          adminState.products[index] = updated;
          adminRenderProducts();
          adminSelectProduct(updated.id);
        }
      }
      adminLoadActivity();
    })
    .catch(err => {
      adminSetMessage("admin-form-message", err.message);
    });
}

function adminArchiveSelected() {
  const idVal = document.getElementById("admin-product-id").value;
  if (!idVal) {
    adminSetMessage("admin-form-message", "Select a product first.");
    return;
  }
  const id = parseInt(idVal, 10);
  adminOpenModal("Archive this product?", () => {
    adminApi("/admin/api/products/" + id, {
      method: "DELETE"
    })
      .then(() => {
        adminSetMessage("admin-form-message", "Archived.");
        adminLoadProducts(document.getElementById("admin-search-input").value.trim());
        adminLoadActivity();
      })
      .catch(err => {
        adminSetMessage("admin-form-message", err.message);
      });
  });
}

function adminReorderPersist() {
  const orderedIds = adminState.products.map(p => p.id);
  adminApi("/admin/api/products/reorder", {
    method: "POST",
    body: { orderedIds }
  })
    .then(() => {
      adminLoadProducts(document.getElementById("admin-search-input").value.trim());
    })
    .catch(() => {});
}

function adminExport() {
  fetch("/admin/api/products/export", {
    method: "GET"
  })
    .then(r => {
      if (!r.ok) throw new Error("Export failed");
      return r.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products-export.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    })
    .catch(err => {
      adminSetMessage("admin-form-message", err.message);
    });
}

// Bulk import is handled by letting the browser read a JSON file and
// sending its contents to the backend. This keeps the server API simple.
function adminImport(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const products = Array.isArray(parsed) ? parsed : parsed.products;
      if (!Array.isArray(products)) {
        adminSetMessage("admin-form-message", "Import file must contain an array or { products: [...] }.");
        return;
      }
      adminApi("/admin/api/products/import", {
        method: "POST",
        body: { products }
      })
        .then(() => {
          adminSetMessage("admin-form-message", "Imported products.");
          adminLoadProducts(document.getElementById("admin-search-input").value.trim());
          adminLoadActivity();
        })
        .catch(err => {
          adminSetMessage("admin-form-message", err.message);
        });
    } catch {
      adminSetMessage("admin-form-message", "Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

// Minimal, reusable confirmation modal instead of relying on window.confirm.
function adminOpenModal(message, onConfirm) {
  const backdrop = document.getElementById("admin-modal-backdrop");
  const body = document.getElementById("admin-modal-body");
  const confirmBtn = document.getElementById("admin-modal-confirm");
  const cancelBtn = document.getElementById("admin-modal-cancel");
  if (!backdrop || !body || !confirmBtn || !cancelBtn) return;
  body.textContent = message;
  backdrop.style.display = "flex";
  const close = () => {
    backdrop.style.display = "none";
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
  };
  confirmBtn.onclick = () => {
    close();
    if (typeof onConfirm === "function") {
      onConfirm();
    }
  };
  cancelBtn.onclick = close;
}

function adminBindEvents() {
  const loginBtn = document.getElementById("admin-login-btn");
  const mfaBtn = document.getElementById("admin-mfa-btn");
  const newBtn = document.getElementById("admin-new-btn");
  const saveBtn = document.getElementById("admin-save-btn");
  const archiveBtn = document.getElementById("admin-archive-btn");
  const searchInput = document.getElementById("admin-search-input");
  const refreshBtn = document.getElementById("admin-refresh-btn");
  const exportBtn = document.getElementById("admin-export-btn");
  const importBtn = document.getElementById("admin-import-btn");
  const importFile = document.getElementById("admin-import-file");
  const logoutBtn = document.getElementById("admin-logout-btn");
  const nameEl = document.getElementById("admin-name");
  const descEl = document.getElementById("admin-description");
  const priceEl = document.getElementById("admin-price");
  const invEl = document.getElementById("admin-inventory");
  const imgEl = document.getElementById("admin-image-url");
  const archEl = document.getElementById("admin-archived");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("admin-email").value.trim();
      const password = document.getElementById("admin-password").value;
      adminSetMessage("admin-login-message", "");
      adminApi("/admin/auth/login", {
        method: "POST",
        body: { email, password }
      })
        .then(data => {
          adminState.mfaPending = true;
          document.getElementById("admin-mfa-card").style.display = "block";
          adminSetMessage("admin-login-message", "Enter your authenticator code.");
        })
        .catch(err => {
          adminSetMessage("admin-login-message", err.message);
        });
    });
  }
  if (mfaBtn) {
    mfaBtn.addEventListener("click", () => {
      const code = document.getElementById("admin-mfa-code").value.trim();
      adminSetMessage("admin-mfa-message", "");
      adminApi("/admin/auth/mfa", {
        method: "POST",
        body: { code }
      })
        .then(data => {
          adminState.mfaPending = false;
          document.getElementById("admin-login-view").style.display = "none";
          document.getElementById("admin-dashboard-view").style.display = "block";
          adminLoadProducts();
          adminLoadActivity();
        })
        .catch(err => {
          adminSetMessage("admin-mfa-message", err.message);
        });
    });
  }
  if (newBtn) {
    newBtn.addEventListener("click", () => {
      adminState.selectedId = null;
      adminFillForm(null);
    });
  }
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      adminSaveProduct();
    });
  }
  if (archiveBtn) {
    archiveBtn.addEventListener("click", () => {
      adminArchiveSelected();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim();
      adminLoadProducts(q);
    });
  }
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      adminLoadProducts(document.getElementById("admin-search-input").value.trim());
    });
  }
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      adminExport();
    });
  }
  if (importBtn && importFile) {
    importBtn.addEventListener("click", () => {
      importFile.click();
    });
    importFile.addEventListener("change", () => {
      const file = importFile.files && importFile.files[0];
      if (file) {
        adminImport(file);
        importFile.value = "";
      }
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      adminApi("/admin/auth/logout", { method: "POST" }).finally(() => {
        window.location.reload();
      });
    });
  }
  [nameEl, descEl, priceEl, invEl, imgEl, archEl].forEach(el => {
    if (el) {
      el.addEventListener("input", adminRenderPreview);
      el.addEventListener("change", adminRenderPreview);
    }
  });
  const list = document.getElementById("admin-products-list");
  if (list) {
    list.addEventListener("drop", e => {
      e.preventDefault();
      if (adminState.dragId) {
        adminReorderPersist();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  adminBindEvents();
});
