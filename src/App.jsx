import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const CUISINE_TYPES = ["Italian", "Japanese", "Mexican", "Thai", "American", "Indian", "French", "Mediterranean", "Chinese", "Other"];
const RECIPE_CATEGORIES = ["Dinner", "Lunch", "Breakfast", "Dessert", "Snack", "Drinks", "Other"];
const DIFFICULTY = ["Easy", "Medium", "Hard"];

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: "#5c3d2e", color: "#f5ede0", padding: "12px 28px", borderRadius: 40,
      fontFamily: "'Lora', serif", fontSize: 15, boxShadow: "0 4px 24px rgba(92,61,46,0.25)",
      zIndex: 9999, animation: "fadeInUp 0.3s ease"
    }}>
      {message}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(44,26,16,0.45)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fdf6ee", borderRadius: 20, padding: "36px 32px", width: "100%",
        maxWidth: 480, boxShadow: "0 8px 48px rgba(92,61,46,0.2)", maxHeight: "90vh", overflowY: "auto"
      }}>
        {children}
      </div>
    </div>
  );
}

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} onClick={() => onChange && onChange(s)} style={{
          fontSize: 24, cursor: onChange ? "pointer" : "default",
          color: s <= value ? "#c0622f" : "#d9c5b0", transition: "color 0.15s"
        }}>★</span>
      ))}
    </div>
  );
}

function Tag({ label, color = "#e8d5c0" }) {
  return (
    <span style={{
      background: color, color: "#5c3d2e", fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em", textTransform: "uppercase",
      fontFamily: "'DM Sans', sans-serif"
    }}>{label}</span>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #d9c5b0",
  background: "#fdf6ee", color: "#3a2215", fontFamily: "'DM Sans', sans-serif", fontSize: 14,
  outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
};
const labelStyle = {
  display: "block", marginBottom: 5, fontFamily: "'DM Sans', sans-serif",
  fontSize: 12, fontWeight: 700, color: "#8c6545", letterSpacing: "0.07em", textTransform: "uppercase"
};
const btnPrimary = {
  background: "#c0622f", color: "#fdf6ee", border: "none", borderRadius: 12,
  padding: "11px 26px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
  fontSize: 14, cursor: "pointer", transition: "background 0.2s"
};
const btnSecondary = {
  background: "transparent", color: "#8c6545", border: "1.5px solid #d9c5b0",
  borderRadius: 12, padding: "10px 22px", fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600, fontSize: 14, cursor: "pointer"
};

const cuisineColors = { Italian: "#f5e6d0", Japanese: "#fde0e0", Mexican: "#fef3d0", Thai: "#e0f5e0", American: "#e0eaf5", Indian: "#fde8d0", French: "#f0e0f5", Mediterranean: "#d0f0e8", Chinese: "#ffe0e0", Other: "#ece8e0" };
const difficultyColors = { Easy: "#d4edda", Medium: "#fff3cd", Hard: "#f8d7da" };
const catColors = { Dinner: "#f5e6d0", Lunch: "#fef3d0", Breakfast: "#ffe8cc", Dessert: "#fde0e8", Snack: "#e0f5e0", Drinks: "#e0eaf5", Other: "#ece8e0" };

function RestaurantForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: "", cuisine: "Other", city: "", notes: "", priority: 3, url: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div>
      <h2 style={{ fontFamily: "'Lora', serif", color: "#3a2215", marginBottom: 24, fontSize: 22 }}>
        {initial ? "Edit Restaurant" : "Add a Restaurant"}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={labelStyle}>Restaurant Name *</label>
          <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Osteria Papavero" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Cuisine</label>
            <select style={inputStyle} value={form.cuisine} onChange={e => set("cuisine", e.target.value)}>
              {CUISINE_TYPES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>City / Location</label>
            <input style={inputStyle} value={form.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Madison, WI" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Priority (1–5 stars)</label>
          <StarRating value={form.priority} onChange={v => set("priority", v)} />
        </div>
        <div>
          <label style={labelStyle}>Link / Website</label>
          <input style={inputStyle} value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Why you want to go, what to order..." />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
        <button style={btnSecondary} onClick={onClose}>Cancel</button>
        <button style={btnPrimary} onClick={() => { if (!form.name.trim()) return; onSave(form); }}>
          {initial ? "Save Changes" : "Add Restaurant"}
        </button>
      </div>
    </div>
  );
}

function RecipeForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: "", category: "Dinner", difficulty: "Medium", source: "", notes: "", priority: 3, time_est: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div>
      <h2 style={{ fontFamily: "'Lora', serif", color: "#3a2215", marginBottom: 24, fontSize: 22 }}>
        {initial ? "Edit Recipe" : "Add a Recipe"}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={labelStyle}>Recipe Name *</label>
          <input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Carbonara, Tiramisu..." />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
              {RECIPE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Difficulty</label>
            <select style={inputStyle} value={form.difficulty} onChange={e => set("difficulty", e.target.value)}>
              {DIFFICULTY.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Est. Cook Time</label>
            <input style={inputStyle} value={form.time_est} onChange={e => set("time_est", e.target.value)} placeholder="e.g. 45 min" />
          </div>
          <div>
            <label style={labelStyle}>Priority (1–5 stars)</label>
            <StarRating value={form.priority} onChange={v => set("priority", v)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Source / Recipe Link</label>
          <input style={inputStyle} value={form.source} onChange={e => set("source", e.target.value)} placeholder="URL or cookbook name..." />
        </div>
        <div>
          <label style={labelStyle}>Notes</label>
          <textarea style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Why you want to try this, any substitutions..." />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
        <button style={btnSecondary} onClick={onClose}>Cancel</button>
        <button style={btnPrimary} onClick={() => { if (!form.name.trim()) return; onSave(form); }}>
          {initial ? "Save Changes" : "Add Recipe"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("restaurants");
  const [restaurants, setRestaurants] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: r }, { data: rc }] = await Promise.all([
      supabase.from("restaurants").select("*").order("priority", { ascending: false }),
      supabase.from("recipes").select("*").order("priority", { ascending: false }),
    ]);
    if (r) setRestaurants(r);
    if (rc) setRecipes(rc);
    setLoading(false);
  }

  function showToast(msg) { setToast(msg); }

  async function addRestaurant(form) {
    const added_at = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const { data, error } = await supabase.from("restaurants").insert([{ ...form, added_at }]).select();
    if (!error && data) {
      setRestaurants(prev => [data[0], ...prev]);
      setShowAddRestaurant(false);
      showToast("🍽️ Restaurant added!");
    }
  }

  async function addRecipe(form) {
    const added_at = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const { data, error } = await supabase.from("recipes").insert([{ ...form, added_at }]).select();
    if (!error && data) {
      setRecipes(prev => [data[0], ...prev]);
      setShowAddRecipe(false);
      showToast("👨‍🍳 Recipe saved!");
    }
  }

  async function updateRestaurant(form) {
    const { data, error } = await supabase.from("restaurants").update(form).eq("id", editItem.id).select();
    if (!error && data) {
      setRestaurants(prev => prev.map(r => r.id === editItem.id ? data[0] : r));
      setEditItem(null);
      showToast("✅ Updated!");
    }
  }

  async function updateRecipe(form) {
    const { data, error } = await supabase.from("recipes").update(form).eq("id", editItem.id).select();
    if (!error && data) {
      setRecipes(prev => prev.map(r => r.id === editItem.id ? data[0] : r));
      setEditItem(null);
      showToast("✅ Updated!");
    }
  }

  async function deleteRestaurant(id) {
    await supabase.from("restaurants").delete().eq("id", id);
    setRestaurants(prev => prev.filter(r => r.id !== id));
    setViewItem(null);
    showToast("Removed.");
  }

  async function deleteRecipe(id) {
    await supabase.from("recipes").delete().eq("id", id);
    setRecipes(prev => prev.filter(r => r.id !== id));
    setViewItem(null);
    showToast("Removed.");
  }

  const filteredRestaurants = restaurants.filter(r =>
    (filterCuisine === "All" || r.cuisine === filterCuisine) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.city?.toLowerCase().includes(search.toLowerCase()) ||
      r.notes?.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredRecipes = recipes.filter(r =>
    (filterCategory === "All" || r.category === filterCategory) &&
    (r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.notes?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f9f0e3", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeInUp { from { opacity:0; transform:translate(-50%,12px); } to { opacity:1; transform:translate(-50%,0); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .card-item:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(92,61,46,0.13) !important; }
        input:focus, select:focus, textarea:focus { border-color: #c0622f !important; }
        .tab-btn:hover { background: #f0e4d4 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#3a2215", padding: "32px 24px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#c9a882", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>
          Carsten & Dasha
        </div>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: 36, color: "#f9f0e3", margin: 0, fontWeight: 600 }}>
          Our Food List
        </h1>
        <p style={{ color: "#9e7a5a", fontSize: 14, margin: "8px 0 0" }}>Restaurants to visit · Recipes to cook</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          <div style={{ background: "#5c3d2e", borderRadius: 50, padding: "6px 18px", fontSize: 13, color: "#c9a882" }}>
            🍴 {restaurants.length} restaurants
          </div>
          <div style={{ background: "#5c3d2e", borderRadius: 50, padding: "6px 18px", fontSize: 13, color: "#c9a882" }}>
            👨‍🍳 {recipes.length} recipes
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#f0e4d4", borderBottom: "2px solid #e2cdb8" }}>
        {["restaurants", "recipes"].map(t => (
          <button key={t} className="tab-btn" onClick={() => { setTab(t); setSearch(""); setFilterCuisine("All"); setFilterCategory("All"); }} style={{
            flex: 1, padding: "16px", border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14,
            letterSpacing: "0.04em", textTransform: "uppercase",
            background: tab === t ? "#fdf6ee" : "transparent",
            color: tab === t ? "#c0622f" : "#8c6545",
            borderBottom: tab === t ? "2px solid #c0622f" : "2px solid transparent",
            transition: "all 0.2s"
          }}>
            {t === "restaurants" ? "🍽️ Restaurants" : "👨‍🍳 Recipes"}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px" }}>
        {/* Search + Filter + Add */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            style={{ ...inputStyle, flex: 1, minWidth: 160 }}
            placeholder={tab === "restaurants" ? "Search restaurants..." : "Search recipes..."}
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {tab === "restaurants" && (
            <select style={{ ...inputStyle, width: "auto" }} value={filterCuisine} onChange={e => setFilterCuisine(e.target.value)}>
              <option>All</option>
              {CUISINE_TYPES.map(c => <option key={c}>{c}</option>)}
            </select>
          )}
          {tab === "recipes" && (
            <select style={{ ...inputStyle, width: "auto" }} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option>All</option>
              {RECIPE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          )}
          <button style={{ ...btnPrimary, whiteSpace: "nowrap" }}
            onClick={() => tab === "restaurants" ? setShowAddRestaurant(true) : setShowAddRecipe(true)}>
            + Add {tab === "restaurants" ? "Restaurant" : "Recipe"}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "56px 0", color: "#b89880" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🍴</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 16 }}>Loading...</div>
          </div>
        )}

        {/* Restaurant Cards */}
        {!loading && tab === "restaurants" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredRestaurants.length === 0 && (
              <div style={{ textAlign: "center", padding: "56px 0", color: "#b89880" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 18, color: "#8c6545" }}>No restaurants yet</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Add your first spot to visit!</div>
              </div>
            )}
            {filteredRestaurants.map(r => (
              <div key={r.id} className="card-item" onClick={() => setViewItem({ type: "restaurant", data: r })} style={{
                background: "#fdf6ee", borderRadius: 16, padding: "18px 20px", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(92,61,46,0.07)", border: "1.5px solid #e8d5c0",
                transition: "all 0.2s", animation: "fadeIn 0.3s ease"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: 17, color: "#3a2215", fontWeight: 600, marginBottom: 6 }}>{r.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: r.notes ? 8 : 0 }}>
                      <Tag label={r.cuisine} color={cuisineColors[r.cuisine] || "#ece8e0"} />
                      {r.city && <Tag label={r.city} color="#ece8e0" />}
                    </div>
                    {r.notes && <div style={{ fontSize: 13, color: "#8c6545", lineHeight: 1.5, marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.notes}</div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <StarRating value={r.priority} />
                    <div style={{ fontSize: 11, color: "#b89880", marginTop: 4 }}>{r.added_at}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recipe Cards */}
        {!loading && tab === "recipes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredRecipes.length === 0 && (
              <div style={{ textAlign: "center", padding: "56px 0", color: "#b89880" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🍳</div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 18, color: "#8c6545" }}>No recipes yet</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Add your first recipe to cook!</div>
              </div>
            )}
            {filteredRecipes.map(r => (
              <div key={r.id} className="card-item" onClick={() => setViewItem({ type: "recipe", data: r })} style={{
                background: "#fdf6ee", borderRadius: 16, padding: "18px 20px", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(92,61,46,0.07)", border: "1.5px solid #e8d5c0",
                transition: "all 0.2s", animation: "fadeIn 0.3s ease"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: 17, color: "#3a2215", fontWeight: 600, marginBottom: 6 }}>{r.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: r.notes ? 8 : 0 }}>
                      <Tag label={r.category} color={catColors[r.category] || "#ece8e0"} />
                      <Tag label={r.difficulty} color={difficultyColors[r.difficulty] || "#ece8e0"} />
                      {r.time_est && <Tag label={r.time_est} color="#ece8e0" />}
                    </div>
                    {r.notes && <div style={{ fontSize: 13, color: "#8c6545", lineHeight: 1.5, marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.notes}</div>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <StarRating value={r.priority} />
                    <div style={{ fontSize: 11, color: "#b89880", marginTop: 4 }}>{r.added_at}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewItem && (
        <Modal onClose={() => setViewItem(null)}>
          {viewItem.type === "restaurant" ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Lora', serif", color: "#3a2215", margin: 0, fontSize: 22, flex: 1 }}>{viewItem.data.name}</h2>
                <button onClick={() => setViewItem(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#b89880", padding: "0 0 0 12px" }}>✕</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                <Tag label={viewItem.data.cuisine} color={cuisineColors[viewItem.data.cuisine] || "#ece8e0"} />
                {viewItem.data.city && <Tag label={viewItem.data.city} color="#ece8e0" />}
              </div>
              <StarRating value={viewItem.data.priority} />
              {viewItem.data.notes && <p style={{ color: "#5c3d2e", lineHeight: 1.7, marginTop: 14, fontSize: 14 }}>{viewItem.data.notes}</p>}
              {viewItem.data.url && (
                <a href={viewItem.data.url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8, color: "#c0622f", fontSize: 13, textDecoration: "underline" }}>
                  Visit website ↗
                </a>
              )}
              <div style={{ fontSize: 11, color: "#b89880", marginTop: 14 }}>Added {viewItem.data.added_at}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button style={btnSecondary} onClick={() => { setEditItem(viewItem.data); setViewItem(null); }}>Edit</button>
                <button style={{ ...btnSecondary, color: "#c0622f", borderColor: "#f0c0a8" }} onClick={() => deleteRestaurant(viewItem.data.id)}>Remove</button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Lora', serif", color: "#3a2215", margin: 0, fontSize: 22, flex: 1 }}>{viewItem.data.name}</h2>
                <button onClick={() => setViewItem(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#b89880", padding: "0 0 0 12px" }}>✕</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                <Tag label={viewItem.data.category} color={catColors[viewItem.data.category] || "#ece8e0"} />
                <Tag label={viewItem.data.difficulty} color={difficultyColors[viewItem.data.difficulty] || "#ece8e0"} />
                {viewItem.data.time_est && <Tag label={viewItem.data.time_est} color="#ece8e0" />}
              </div>
              <StarRating value={viewItem.data.priority} />
              {viewItem.data.notes && <p style={{ color: "#5c3d2e", lineHeight: 1.7, marginTop: 14, fontSize: 14 }}>{viewItem.data.notes}</p>}
              {viewItem.data.source && (
                viewItem.data.source.startsWith("http") ? (
                  <a href={viewItem.data.source} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 8, color: "#c0622f", fontSize: 13, textDecoration: "underline" }}>
                    View recipe ↗
                  </a>
                ) : (
                  <div style={{ fontSize: 13, color: "#8c6545", marginTop: 10 }}>Source: {viewItem.data.source}</div>
                )
              )}
              <div style={{ fontSize: 11, color: "#b89880", marginTop: 14 }}>Added {viewItem.data.added_at}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button style={btnSecondary} onClick={() => { setEditItem({ ...viewItem.data, _type: "recipe" }); setViewItem(null); }}>Edit</button>
                <button style={{ ...btnSecondary, color: "#c0622f", borderColor: "#f0c0a8" }} onClick={() => deleteRecipe(viewItem.data.id)}>Remove</button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Add/Edit Modals */}
      {showAddRestaurant && <Modal onClose={() => setShowAddRestaurant(false)}><RestaurantForm onSave={addRestaurant} onClose={() => setShowAddRestaurant(false)} /></Modal>}
      {showAddRecipe && <Modal onClose={() => setShowAddRecipe(false)}><RecipeForm onSave={addRecipe} onClose={() => setShowAddRecipe(false)} /></Modal>}
      {editItem && !editItem._type && <Modal onClose={() => setEditItem(null)}><RestaurantForm initial={editItem} onSave={updateRestaurant} onClose={() => setEditItem(null)} /></Modal>}
      {editItem && editItem._type === "recipe" && <Modal onClose={() => setEditItem(null)}><RecipeForm initial={editItem} onSave={updateRecipe} onClose={() => setEditItem(null)} /></Modal>}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
