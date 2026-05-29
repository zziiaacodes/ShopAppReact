import React, { useState } from "react";
// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:          "#F7F5F2",
  surface:     "#FFFFFF",
  card:        "#FFFFFF",
  border:      "#E8E4DF",
  accent:      "#1A1A1A",
  warm:        "#C9622F",
  text:        "#1A1A1A",
  muted:       "#9A9188",
  light:       "#EAE7E2",
  green:       "#3A8C55",
  greenBg:     "#E8F4EC",
  greenBorder: "#C3E0CC",
  saved:       "#E8483A",
  purple:      "#F5F3FF",
  purpleBorder:"#DDD8F5",
};

const palette = [
  "#D4C5B2","#A8B5AD","#C4A882","#B8C4CC","#D6BFA8",
  "#9DAA9E","#CBB99A","#AFC0C8","#E2D5C3","#B4C2B8",
  "#CDBFB0","#A5B8B0",
];

const ALL_STORES = [
  { id:"zara",       name:"Zara",            cat:"High Street",  color:"#1A1A1A" },
  { id:"asos",       name:"ASOS",            cat:"Multi-brand",  color:"#2C6EAD" },
  { id:"hm",         name:"H&M",             cat:"High Street",  color:"#CC0000" },
  { id:"nordstrom",  name:"Nordstrom",       cat:"Luxury Dept",  color:"#1B3D6E" },
  { id:"mango",      name:"Mango",           cat:"High Street",  color:"#8B6F47" },
  { id:"cos",        name:"COS",             cat:"Contemporary", color:"#4A4A4A" },
  { id:"arket",      name:"Arket",           cat:"Contemporary", color:"#2E4A3E" },
  { id:"other",      name:"& Other Stories", cat:"Contemporary", color:"#8C6B8C" },
  { id:"uniqlo",     name:"Uniqlo",          cat:"Essentials",   color:"#CC0000" },
  { id:"everlane",   name:"Everlane",        cat:"Sustainable",  color:"#3D3D3D" },
  { id:"reformation",name:"Reformation",    cat:"Sustainable",  color:"#6B8C6B" },
  { id:"sezane",     name:"Sézane",          cat:"Contemporary", color:"#C4956A" },
  { id:"jcrew",      name:"J.Crew",          cat:"Classic",      color:"#1E4D8C" },
  { id:"rag",        name:"Rag & Bone",      cat:"Luxury",       color:"#2A2A2A" },
  { id:"ba",         name:"ba&sh",           cat:"Contemporary", color:"#A0522D" },
  { id:"reiss",      name:"Reiss",           cat:"Contemporary", color:"#1A1A2E" },
];

const TAGS = ["trending","new","under $50","sustainable","bestseller"];

function generateItems(query, mallStoreIds) {
  const stores = mallStoreIds && mallStoreIds.length > 0
    ? ALL_STORES.filter(s => mallStoreIds.includes(s.id))
    : ALL_STORES;
  if (!stores.length) return [];
  return Array.from({ length: 32 }, (_, i) => {
    const store = stores[i % stores.length];
    return {
      id: `${query}-${i}`,
      store: store.name, storeId: store.id, storeColor: store.color,
      price: `$${(Math.random() * 130 + 18).toFixed(0)}`,
      tag: Math.random() > 0.72 ? TAGS[i % TAGS.length] : null,
      color: palette[i % palette.length],
      color2: palette[(i + 4) % palette.length],
      height: [200, 260, 220, 280, 240, 190, 250][i % 7],
      name: `${query.charAt(0).toUpperCase() + query.slice(1)} — Style ${i + 1}`,
      inStock: Math.random() > 0.08,
    };
  });
}

const DEFAULT_CLOSETS = [
  { id:"c1", name:"Wishlist",  icon:"✦", color:"#C9622F", isPrivate:true, items:[
    { id:"ci1", name:"Silk Midi Dress",   store:"Sézane", price:"$89",  color:palette[0], color2:palette[4] },
    { id:"ci2", name:"Wide Leg Trousers", store:"Arket",  price:"$65",  color:palette[1], color2:palette[5] },
    { id:"ci3", name:"Linen Blazer",      store:"COS",    price:"$145", color:palette[2], color2:palette[6] },
    { id:"ci4", name:"Leather Loafers",   store:"Mango",  price:"$120", color:palette[3], color2:palette[7] },
  ]},
  { id:"c2", name:"Workwear",  icon:"◆", color:"#1B3D6E", isPrivate:true, items:[
    { id:"ci5", name:"Tailored Blazer",   store:"Reiss",  price:"$210", color:palette[4], color2:palette[8] },
    { id:"ci6", name:"Ribbed Tank",       store:"Uniqlo", price:"$35",  color:palette[5], color2:palette[9] },
    { id:"ci7", name:"Pleated Trousers",  store:"COS",    price:"$95",  color:palette[6], color2:palette[10] },
  ]},
  { id:"c3", name:"Weekend",   icon:"○", color:"#3A8C55", isPrivate:true, items:[
    { id:"ci8", name:"Oversized Coat",    store:"& Other Stories", price:"$210", color:palette[7], color2:palette[11] },
    { id:"ci9", name:"Knit Co-ord",       store:"Zara",   price:"$78",  color:palette[8], color2:palette[0] },
  ]},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function groupByStore(items) {
  return items.reduce((acc, item) => {
    if (!acc[item.store]) acc[item.store] = [];
    acc[item.store].push(item);
    return acc;
  }, {});
}

// ── Save picker ───────────────────────────────────────────────────────────────
function SavePicker({ item, closets, onSave, onClose }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, zIndex:999,
      background:"rgba(0,0,0,0.3)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:C.surface, borderRadius:20, padding:24,
        width:300, boxShadow:"0 24px 60px rgba(0,0,0,0.15)",
        border:`1px solid ${C.border}`,
      }}>
        <div style={{fontSize:15, fontWeight:800, color:C.text, marginBottom:4, fontFamily:"'Cormorant Garamond',serif"}}>Save to closet</div>
        <div style={{fontSize:12, color:C.muted, marginBottom:20}}>{item.name} · {item.store}</div>
        <div style={{display:"flex", flexDirection:"column", gap:8}}>
          {closets.map(cl => (
            <button key={cl.id} onClick={() => onSave(cl.id)} style={{
              display:"flex", alignItems:"center", gap:12,
              background:C.light, border:`1.5px solid ${C.border}`,
              borderRadius:12, padding:"11px 14px", cursor:"pointer",
              textAlign:"left", transition:"border-color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = cl.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{width:26, height:26, borderRadius:"50%", background:cl.color, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                <span style={{color:"#fff", fontSize:11}}>{cl.icon}</span>
              </div>
              <div>
                <div style={{fontSize:13, fontWeight:700, color:C.text}}>{cl.name}</div>
                <div style={{fontSize:11, color:C.muted}}>{cl.items.length} items · {cl.isPrivate ? "🔒 Private" : "🌐 Public"}</div>
              </div>
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{
          marginTop:14, width:"100%", background:"none",
          border:`1px solid ${C.border}`, borderRadius:10,
          padding:"9px", fontSize:12, color:C.muted, cursor:"pointer",
        }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Item card ─────────────────────────────────────────────────────────────────
function ItemCard({ item, onSaveClick, savedIds }) {
  const [hov, setHov] = useState(false);
  const isSaved = savedIds && savedIds.has(item.id);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:14, overflow:"hidden", background:C.card,
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.05)",
        transition:"box-shadow 0.2s, transform 0.2s",
        transform: hov ? "translateY(-2px)" : "none",
        cursor:"pointer", marginBottom:10,
      }}>
      <div style={{
        height:item.height, position:"relative",
        background:`linear-gradient(155deg,${item.color},${item.color2})`,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <div style={{width:"52%", height:"68%", borderRadius:8, background:"rgba(255,255,255,0.16)", backdropFilter:"blur(2px)"}}/>

        {/* Store pill */}
        <div style={{
          position:"absolute", bottom:9, left:9,
          background:"rgba(255,255,255,0.93)", backdropFilter:"blur(6px)",
          borderRadius:20, padding:"3px 9px",
          display:"flex", alignItems:"center", gap:5,
        }}>
          <div style={{width:6, height:6, borderRadius:"50%", background:item.storeColor, flexShrink:0}}/>
          <span style={{fontSize:10, fontWeight:700, color:C.text}}>{item.store}</span>
        </div>

        {item.tag && (
          <div style={{
            position:"absolute", top:9, left:9,
            background:C.warm, color:"#fff",
            fontSize:9, fontWeight:700, padding:"3px 8px",
            borderRadius:20, letterSpacing:"0.05em", textTransform:"uppercase",
          }}>{item.tag}</div>
        )}

        <button onClick={e => { e.stopPropagation(); onSaveClick(item); }} style={{
          position:"absolute", top:9, right:9,
          background: isSaved ? C.saved : "rgba(255,255,255,0.88)",
          border:"none", borderRadius:"50%", width:30, height:30,
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, color: isSaved ? "#fff" : C.text,
          opacity: hov || isSaved ? 1 : 0,
          transition:"opacity 0.18s, transform 0.15s",
          transform: hov ? "scale(1.08)" : "scale(1)",
          boxShadow:"0 2px 8px rgba(0,0,0,0.10)",
        }}>{isSaved ? "♥" : "♡"}</button>
      </div>

      <div style={{padding:"9px 11px 11px", display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div style={{fontSize:12, color:C.text, lineHeight:1.35, flex:1, marginRight:8}}>{item.name}</div>
        <div style={{textAlign:"right", flexShrink:0}}>
          <div style={{fontSize:13, fontWeight:700, color:C.text}}>{item.price}</div>
          <div style={{fontSize:9, fontWeight:700, marginTop:1, color: item.inStock ? C.green : C.muted}}>
            {item.inStock ? "● IN STOCK" : "○ OUT"}
          </div>
        </div>
      </div>
    </div>
  );
}

function MasonryGrid({ items, onSaveClick, savedIds }) {
  const cols = [[], [], [], []];
  items.forEach((item, i) => cols[i % 4].push(item));
  return (
    <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10}}>
      {cols.map((col, ci) => (
        <div key={ci}>
          {col.map(item => <ItemCard key={item.id} item={item} onSaveClick={onSaveClick} savedIds={savedIds}/>)}
        </div>
      ))}
    </div>
  );
}

// ── Explore screen ────────────────────────────────────────────────────────────
function ExploreScreen({ mallIds, savedIds, closets, onSaveClick }) {
  const [mode, setMode] = useState("explore"); // "explore" | "mall"
  const [searched, setSearched] = useState("midi dress");
  const [items, setItems] = useState(() => generateItems("midi dress", []));
  const [loading, setLoading] = useState(false);
  const [localQuery, setLocalQuery] = useState("");

  const doSearch = (q) => {
    const term = (q || localQuery || "").trim();
    if (!term) return;
    setLoading(true);
    setTimeout(() => {
      setSearched(term);
      setItems(generateItems(term, mode === "mall" ? [...mallIds] : []));
      setLoading(false);
    }, 450);
  };

  const switchMode = (m) => {
    setMode(m);
    setLoading(true);
    setTimeout(() => {
      setItems(generateItems(searched, m === "mall" ? [...mallIds] : []));
      setLoading(false);
    }, 350);
  };

  const CHIPS = ["black pants","linen blazer","midi skirt","white tee","loafers","trench coat"];

  return (
    <div>
      {/* Search */}
      <div style={{position:"relative", marginBottom:14}}>
        <input
          type="text"
          defaultValue=""
          onChange={e => setLocalQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && doSearch()}
          placeholder='Search anything — "black pants", "linen blazer"…'
          style={{
            display:"block", width:"100%", boxSizing:"border-box",
            background:C.surface, border:`1.5px solid ${C.border}`,
            borderRadius:50, padding:"13px 50px 13px 20px",
            fontSize:"16px", color:"#1A1A1A",
            WebkitTextFillColor:"#1A1A1A", caretColor:"#1A1A1A",
            outline:"none", fontFamily:"inherit",
          }}
        />
        <button onMouseDown={e => e.preventDefault()} onClick={() => doSearch()} style={{
          position:"absolute", right:6, top:"50%", transform:"translateY(-50%)",
          background:C.accent, border:"none", borderRadius:50,
          width:36, height:36, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:15,
        }}>🔍</button>
      </div>

      {/* Mode toggle + chips row */}
      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:18, flexWrap:"wrap"}}>
        {/* Toggle pill */}
        <div style={{
          display:"flex", background:C.light,
          borderRadius:50, padding:3, flexShrink:0,
          border:`1px solid ${C.border}`,
        }}>
          {[{id:"explore", label:"All stores"}, {id:"mall", label:"My Mall"}].map(m => (
            <button key={m.id} onClick={() => switchMode(m.id)} style={{
              padding:"6px 16px", borderRadius:50, border:"none",
              background: mode === m.id ? C.accent : "transparent",
              color: mode === m.id ? "#fff" : C.muted,
              fontSize:12, fontWeight:700, cursor:"pointer",
              transition:"all 0.18s", whiteSpace:"nowrap",
            }}>{m.label}
            {m.id === "mall" && mallIds.size > 0 && mode !== "mall" && (
              <span style={{
                display:"inline-block", width:6, height:6, borderRadius:"50%",
                background:C.green, marginLeft:5, verticalAlign:"middle",
              }}/>
            )}
            </button>
          ))}
        </div>

        {/* Search chips */}
        <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
          {CHIPS.map(q => (
            <button key={q} onClick={() => { setLocalQuery(q); doSearch(q); }} style={{
              background:C.surface, border:`1px solid ${C.border}`,
              color:C.muted, borderRadius:20, padding:"5px 12px",
              fontSize:11, cursor:"pointer",
              boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
            }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Mall empty state */}
      {mode === "mall" && mallIds.size === 0 && (
        <div style={{
          textAlign:"center", padding:"60px 20px",
          background:C.surface, borderRadius:16,
          border:`1.5px dashed ${C.border}`,
        }}>
          <div style={{fontSize:28, marginBottom:12}}>🏪</div>
          <div style={{fontSize:15, fontWeight:700, color:C.text, marginBottom:6, fontFamily:"'Cormorant Garamond',serif"}}>Your mall is empty</div>
          <div style={{fontSize:13, color:C.muted}}>Go to Profile → My Mall to pick your stores.</div>
        </div>
      )}

      {/* Results header */}
      {!(mode === "mall" && mallIds.size === 0) && (
        <>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
            <div style={{display:"flex", alignItems:"baseline", gap:8}}>
              <span style={{fontSize:17, fontWeight:800, fontFamily:"'Cormorant Garamond',serif", color:C.text}}>"{searched}"</span>
              <span style={{fontSize:12, color:C.muted}}>{items.length} results</span>
              {mode === "mall" && <span style={{fontSize:11, color:C.green, fontWeight:600}}>· your mall</span>}
            </div>
            <div style={{fontSize:11, color:C.green, fontWeight:700}}>● Live stock</div>
          </div>

          {loading ? (
            <div style={{textAlign:"center", padding:80, color:C.muted}}>
              <div style={{fontSize:28, opacity:0.2, marginBottom:12}}>✦</div>
              <div style={{fontSize:13}}>Searching{mode === "mall" ? " your mall" : ""}…</div>
            </div>
          ) : (
            <MasonryGrid items={items} onSaveClick={onSaveClick} savedIds={savedIds}/>
          )}
        </>
      )}
    </div>
  );
}

// ── Closet screen ─────────────────────────────────────────────────────────────
function ClosetsScreen({ closets, setClosets }) {
  const [activeId, setActiveId] = useState(null);
  const [shopMode, setShopMode] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrivate, setNewPrivate] = useState(true);
  const ICONS = ["✦","◆","○","◇","▲","★","♡","◉"];
  const [newIcon, setNewIcon] = useState("✦");

  const createCloset = () => {
    if (!newName.trim()) return;
    const colors = ["#C9622F","#1B3D6E","#3A8C55","#8C6B8C","#C4956A","#2E4A3E"];
    setClosets(prev => [...prev, {
      id:`c-${Date.now()}`, name:newName.trim(), icon:newIcon,
      color:colors[prev.length % colors.length], isPrivate:newPrivate, items:[],
    }]);
    setNewName(""); setNewPrivate(true); setShowNewForm(false);
  };

  const removeItem = (closetId, itemId) => {
    setClosets(prev => prev.map(c =>
      c.id === closetId ? {...c, items: c.items.filter(i => i.id !== itemId)} : c
    ));
  };

  const togglePrivacy = (id) => {
    setClosets(prev => prev.map(c => c.id === id ? {...c, isPrivate:!c.isPrivate} : c));
  };

  // ── Shop mode view ──
  if (activeId && shopMode) {
    const cl = closets.find(c => c.id === activeId);
    if (!cl) { setActiveId(null); setShopMode(false); return null; }
    const grouped = groupByStore(cl.items);
    const storeColors = {};
    ALL_STORES.forEach(s => { storeColors[s.name] = s.color; });

    return (
      <div>
        {/* Header */}
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:28}}>
          <button onClick={() => setShopMode(false)} style={{
            background:C.light, border:"none", borderRadius:20,
            padding:"7px 14px", fontSize:12, fontWeight:700,
            color:C.muted, cursor:"pointer", flexShrink:0,
          }}>← Back</button>
          <div>
            <div style={{fontSize:20, fontWeight:800, fontFamily:"'Cormorant Garamond',serif", color:C.text}}>Shop — {cl.name}</div>
            <div style={{fontSize:12, color:C.muted, marginTop:2}}>{cl.items.length} items across {Object.keys(grouped).length} store{Object.keys(grouped).length !== 1 ? "s" : ""}</div>
          </div>
        </div>

        {cl.items.length === 0 ? (
          <div style={{textAlign:"center", padding:60, color:C.muted}}>
            <div style={{fontSize:13}}>No items in this closet yet.</div>
          </div>
        ) : (
          <div style={{display:"flex", flexDirection:"column", gap:16}}>
            {Object.entries(grouped).map(([storeName, storeItems]) => (
              <div key={storeName} style={{
                background:C.surface, borderRadius:16,
                border:`1px solid ${C.border}`,
                overflow:"hidden",
                boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
              }}>
                {/* Store header */}
                <div style={{
                  padding:"14px 18px",
                  borderBottom:`1px solid ${C.border}`,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                }}>
                  <div style={{display:"flex", alignItems:"center", gap:8}}>
                    <div style={{
                      width:10, height:10, borderRadius:"50%",
                      background: storeColors[storeName] || C.accent, flexShrink:0,
                    }}/>
                    <span style={{fontSize:14, fontWeight:800, color:C.text, fontFamily:"'Cormorant Garamond',serif"}}>{storeName}</span>
                    <span style={{fontSize:12, color:C.muted}}>{storeItems.length} item{storeItems.length !== 1 ? "s" : ""}</span>
                  </div>
                  <button style={{
                    background:C.accent, border:"none", borderRadius:20,
                    color:"#fff", fontSize:12, fontWeight:700,
                    padding:"7px 16px", cursor:"pointer",
                  }}>Open {storeName} →</button>
                </div>

                {/* Items for this store */}
                <div style={{padding:"12px 18px", display:"flex", gap:12, flexWrap:"wrap"}}>
                  {storeItems.map(item => (
                    <div key={item.id} style={{
                      display:"flex", alignItems:"center", gap:10,
                      background:C.bg, borderRadius:12,
                      padding:"8px 12px",
                      border:`1px solid ${C.border}`,
                      flex:"1 1 200px",
                    }}>
                      <div style={{
                        width:40, height:40, borderRadius:8, flexShrink:0,
                        background:`linear-gradient(135deg,${item.color},${item.color2})`,
                      }}/>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize:12, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{item.name}</div>
                        <div style={{fontSize:12, color:C.warm, fontWeight:700, marginTop:2}}>{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Store note */}
                <div style={{
                  padding:"10px 18px 14px",
                  fontSize:11, color:C.muted, lineHeight:1.5,
                }}>
                  Tap "Open {storeName}" to browse these items on their site. Add to your cart there, then come back here.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Single closet view ──
  if (activeId) {
    const cl = closets.find(c => c.id === activeId);
    if (!cl) { setActiveId(null); return null; }
    const cols = [[], [], [], []];
    cl.items.forEach((item, i) => cols[i % 4].push(item));

    return (
      <div>
        {/* Header */}
        <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:24}}>
          <button onClick={() => setActiveId(null)} style={{
            background:C.light, border:"none", borderRadius:20,
            padding:"7px 14px", fontSize:12, fontWeight:700, color:C.muted, cursor:"pointer",
          }}>← Back</button>
          <div style={{flex:1}}>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <div style={{width:28, height:28, borderRadius:"50%", background:cl.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                <span style={{color:"#fff", fontSize:12}}>{cl.icon}</span>
              </div>
              <span style={{fontSize:22, fontWeight:800, fontFamily:"'Cormorant Garamond',serif", color:C.text}}>{cl.name}</span>
              <span style={{
                fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20,
                background: cl.isPrivate ? C.light : C.greenBg,
                color: cl.isPrivate ? C.muted : C.green,
              }}>{cl.isPrivate ? "🔒 Private" : "🌐 Public"}</span>
            </div>
            <div style={{fontSize:12, color:C.muted, marginTop:3, marginLeft:38}}>{cl.items.length} items</div>
          </div>

          <div style={{display:"flex", gap:8, flexShrink:0}}>
            <button onClick={() => togglePrivacy(cl.id)} style={{
              background:C.surface, border:`1px solid ${C.border}`,
              borderRadius:20, padding:"7px 14px",
              fontSize:11, fontWeight:600, color:C.muted, cursor:"pointer",
            }}>{cl.isPrivate ? "Make public" : "Make private"}</button>

            {cl.items.length > 0 && (
              <button onClick={() => setShopMode(true)} style={{
                background:C.accent, border:"none", borderRadius:20,
                color:"#fff", fontSize:12, fontWeight:700,
                padding:"8px 18px", cursor:"pointer",
              }}>Shop this closet →</button>
            )}
          </div>
        </div>

        {cl.items.length === 0 ? (
          <div style={{
            textAlign:"center", padding:"60px 20px",
            background:C.surface, borderRadius:16,
            border:`1.5px dashed ${C.border}`,
          }}>
            <div style={{fontSize:28, marginBottom:10, opacity:0.3}}>✦</div>
            <div style={{fontSize:14, fontWeight:700, color:C.text, marginBottom:6, fontFamily:"'Cormorant Garamond',serif"}}>Empty closet</div>
            <div style={{fontSize:12, color:C.muted}}>Save items from Explore and add them here.</div>
          </div>
        ) : (
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10}}>
            {cols.map((col, ci) => (
              <div key={ci}>
                {col.map(item => (
                  <div key={item.id} style={{
                    borderRadius:14, overflow:"hidden", background:C.card,
                    boxShadow:"0 1px 4px rgba(0,0,0,0.05)", marginBottom:10, position:"relative",
                  }}>
                    <div style={{
                      height:130, position:"relative",
                      background:`linear-gradient(155deg,${item.color},${item.color2})`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <div style={{width:"50%", height:"65%", background:"rgba(255,255,255,0.16)", borderRadius:6}}/>
                      <div style={{
                        position:"absolute", bottom:8, left:8,
                        background:"rgba(255,255,255,0.92)", borderRadius:20,
                        padding:"3px 8px", fontSize:9, fontWeight:700, color:C.text,
                      }}>{item.store}</div>
                      <button onClick={() => removeItem(cl.id, item.id)} style={{
                        position:"absolute", top:8, right:8,
                        background:"rgba(255,255,255,0.85)", border:"none",
                        borderRadius:"50%", width:24, height:24, cursor:"pointer",
                        fontSize:14, color:C.muted,
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>×</button>
                    </div>
                    <div style={{padding:"8px 10px 10px"}}>
                      <div style={{fontSize:11, color:C.text, marginBottom:3, lineHeight:1.3}}>{item.name}</div>
                      <div style={{fontSize:12, fontWeight:700, color:C.text}}>{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Closet list ──
  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24}}>
        <div>
          <div style={{fontSize:28, fontWeight:800, color:C.text, fontFamily:"'Cormorant Garamond',serif"}}>My Closets</div>
          <div style={{fontSize:13, color:C.muted, marginTop:4}}>Private by default — only you can see them.</div>
        </div>
        <button onClick={() => setShowNewForm(v => !v)} style={{
          background: showNewForm ? C.light : C.accent,
          border:"none", borderRadius:20, color: showNewForm ? C.muted : "#fff",
          fontSize:12, fontWeight:700, padding:"9px 18px", cursor:"pointer",
        }}>{showNewForm ? "Cancel" : "+ New"}</button>
      </div>

      {showNewForm && (
        <div style={{
          background:C.surface, border:`1.5px solid ${C.accent}`,
          borderRadius:16, padding:20, marginBottom:24,
          boxShadow:"0 4px 20px rgba(0,0,0,0.06)",
        }}>
          <div style={{fontSize:13, fontWeight:700, color:C.text, marginBottom:14}}>Create a closet</div>
          <div style={{display:"flex", gap:12, marginBottom:14, alignItems:"flex-end"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11, color:C.muted, fontWeight:600, marginBottom:6}}>Name</div>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Vacation, Date Night, Spring…"
                style={{
                  width:"100%", boxSizing:"border-box",
                  background:C.light, border:`1.5px solid ${C.border}`,
                  borderRadius:10, padding:"10px 14px",
                  fontSize:"16px", color:"#1A1A1A",
                  WebkitTextFillColor:"#1A1A1A", caretColor:"#1A1A1A",
                  outline:"none", fontFamily:"inherit",
                }}
              />
            </div>
            <div>
              <div style={{fontSize:11, color:C.muted, fontWeight:600, marginBottom:6}}>Icon</div>
              <div style={{display:"flex", gap:5}}>
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setNewIcon(ic)} style={{
                    width:32, height:32, borderRadius:8,
                    border:`1.5px solid ${newIcon === ic ? C.accent : C.border}`,
                    background: newIcon === ic ? C.accent : C.surface,
                    color: newIcon === ic ? "#fff" : C.text,
                    fontSize:13, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>{ic}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <div onClick={() => setNewPrivate(v => !v)} style={{
                width:38, height:21, borderRadius:20,
                background: newPrivate ? C.accent : C.light,
                border:`1px solid ${newPrivate ? C.accent : C.border}`,
                position:"relative", cursor:"pointer", transition:"background 0.18s",
              }}>
                <div style={{
                  position:"absolute", top:2, left: newPrivate ? 19 : 2,
                  width:15, height:15, borderRadius:"50%",
                  background:"#fff", transition:"left 0.18s",
                  boxShadow:"0 1px 3px rgba(0,0,0,0.15)",
                }}/>
              </div>
              <span style={{fontSize:12, color:C.text, fontWeight:600}}>{newPrivate ? "🔒 Private" : "🌐 Public"}</span>
            </div>
            <button onClick={createCloset} style={{
              background:C.accent, border:"none", borderRadius:20,
              color:"#fff", fontSize:12, fontWeight:700, padding:"9px 20px", cursor:"pointer",
            }}>Create →</button>
          </div>
        </div>
      )}

      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12}}>
        {closets.map(cl => (
          <div key={cl.id} onClick={() => { setActiveId(cl.id); setShopMode(false); }}
            style={{
              borderRadius:16, background:C.card, border:`1px solid ${C.border}`,
              boxShadow:"0 1px 6px rgba(0,0,0,0.04)", cursor:"pointer",
              overflow:"hidden", transition:"box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.09)"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,0.04)"; e.currentTarget.style.transform="none"; }}
          >
            {/* Preview */}
            <div style={{
              height:120, display:"grid",
              gridTemplateColumns: cl.items.length > 1 ? "1fr 1fr" : "1fr",
              gap:2, background:C.light, overflow:"hidden",
            }}>
              {cl.items.length === 0 ? (
                <div style={{display:"flex", alignItems:"center", justifyContent:"center", opacity:0.15, fontSize:26}}>✦</div>
              ) : (
                cl.items.slice(0, 4).map((item, i) => (
                  <div key={i} style={{background:`linear-gradient(155deg,${item.color},${item.color2})`}}/>
                ))
              )}
            </div>

            <div style={{padding:"12px 14px"}}>
              <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:6}}>
                <div style={{width:22, height:22, borderRadius:"50%", background:cl.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                  <span style={{color:"#fff", fontSize:10}}>{cl.icon}</span>
                </div>
                <div style={{fontSize:14, fontWeight:800, color:C.text, fontFamily:"'Cormorant Garamond',serif"}}>{cl.name}</div>
              </div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:11, color:C.muted}}>{cl.items.length} item{cl.items.length !== 1 ? "s" : ""}</span>
                <span style={{
                  fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20,
                  background: cl.isPrivate ? C.light : C.greenBg,
                  color: cl.isPrivate ? C.muted : C.green,
                }}>{cl.isPrivate ? "🔒" : "🌐"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Profile screen ────────────────────────────────────────────────────────────
function ProfileScreen({ mallIds, setMallIds, customStores, setCustomStores }) {
  const [section, setSection] = useState(null); // null | "mall" | "icons"
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreUrl, setNewStoreUrl] = useState("");

  const toggleStore = (id) => setMallIds(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const addCustom = () => {
    if (!newStoreName.trim() || !newStoreUrl.trim()) return;
    const id = `custom-${Date.now()}`;
    const colors = ["#7B6FAE","#6A9E8A","#C4824A","#5A8CB5","#A06B8A"];
    setCustomStores(prev => [...prev, {
      id, name:newStoreName.trim(), url:newStoreUrl.trim(),
      color:colors[prev.length % colors.length], custom:true,
    }]);
    setMallIds(prev => new Set([...prev, id]));
    setNewStoreName(""); setNewStoreUrl(""); setShowAddForm(false);
  };

  const removeCustom = (id) => {
    setCustomStores(prev => prev.filter(s => s.id !== id));
    setMallIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const categories = [...new Set(ALL_STORES.map(s => s.cat))];

  if (section === "mall") {
    return (
      <div>
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:24}}>
          <button onClick={() => setSection(null)} style={{background:C.light, border:"none", borderRadius:20, padding:"7px 14px", fontSize:12, fontWeight:700, color:C.muted, cursor:"pointer"}}>← Back</button>
          <div>
            <div style={{fontSize:22, fontWeight:800, fontFamily:"'Cormorant Garamond',serif", color:C.text}}>My Mall</div>
            <div style={{fontSize:12, color:C.muted, marginTop:2}}>{mallIds.size} store{mallIds.size !== 1 ? "s" : ""} selected</div>
          </div>
        </div>

        {mallIds.size > 0 && (
          <div style={{background:C.greenBg, border:`1px solid ${C.greenBorder}`, borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span style={{fontSize:12, color:C.green, fontWeight:700}}>✓ Active — searches will use your mall</span>
            <button onClick={() => setMallIds(new Set())} style={{background:"none", border:`1px solid ${C.greenBorder}`, borderRadius:20, color:C.muted, fontSize:11, padding:"4px 10px", cursor:"pointer"}}>Clear</button>
          </div>
        )}

        {categories.map(cat => (
          <div key={cat} style={{marginBottom:24}}>
            <div style={{fontSize:11, color:C.muted, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10}}>{cat}</div>
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8}}>
              {ALL_STORES.filter(s => s.cat === cat).map(store => {
                const active = mallIds.has(store.id);
                return (
                  <div key={store.id} onClick={() => toggleStore(store.id)} style={{
                    borderRadius:12, padding:"13px 12px",
                    border:`1.5px solid ${active ? store.color : C.border}`,
                    background: active ? `${store.color}08` : C.surface,
                    cursor:"pointer", transition:"all 0.18s", position:"relative",
                  }}>
                    <div style={{width:24, height:24, borderRadius:"50%", background:store.color, marginBottom:8, display:"flex", alignItems:"center", justifyContent:"center"}}>
                      {active && <span style={{color:"#fff", fontSize:11}}>✓</span>}
                    </div>
                    <div style={{fontSize:12, fontWeight:700, color:C.text, marginBottom:1}}>{store.name}</div>
                    <div style={{position:"absolute", top:8, right:8, fontSize:8, color:C.green, fontWeight:700, background:C.greenBg, borderRadius:8, padding:"2px 5px"}}>✓ vetted</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Custom stores */}
        <div style={{marginBottom:24}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
            <div style={{fontSize:11, color:C.muted, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase"}}>My Own Stores</div>
            <button onClick={() => setShowAddForm(v => !v)} style={{background:showAddForm ? C.light : C.accent, border:"none", borderRadius:20, color:showAddForm ? C.muted : "#fff", fontSize:11, fontWeight:700, padding:"6px 14px", cursor:"pointer"}}>{showAddForm ? "Cancel" : "+ Add"}</button>
          </div>

          {showAddForm && (
            <div style={{background:C.surface, border:`1.5px solid ${C.accent}`, borderRadius:14, padding:18, marginBottom:12}}>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12}}>
                <div>
                  <div style={{fontSize:11, color:C.muted, fontWeight:600, marginBottom:5}}>Store name</div>
                  <input type="text" value={newStoreName} onChange={e => setNewStoreName(e.target.value)} placeholder="e.g. Sandro" style={{width:"100%", boxSizing:"border-box", background:C.light, border:`1.5px solid ${C.border}`, borderRadius:8, padding:"9px 12px", fontSize:"16px", color:"#1A1A1A", WebkitTextFillColor:"#1A1A1A", caretColor:"#1A1A1A", outline:"none", fontFamily:"inherit"}}/>
                </div>
                <div>
                  <div style={{fontSize:11, color:C.muted, fontWeight:600, marginBottom:5}}>Website</div>
                  <input type="text" value={newStoreUrl} onChange={e => setNewStoreUrl(e.target.value)} placeholder="sandro-paris.com" style={{width:"100%", boxSizing:"border-box", background:C.light, border:`1.5px solid ${C.border}`, borderRadius:8, padding:"9px 12px", fontSize:"16px", color:"#1A1A1A", WebkitTextFillColor:"#1A1A1A", caretColor:"#1A1A1A", outline:"none", fontFamily:"inherit"}}/>
                </div>
              </div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:11, color:C.muted}}>⚠️ Added at your own discretion</span>
                <button onClick={addCustom} style={{background:C.accent, border:"none", borderRadius:20, color:"#fff", fontSize:12, fontWeight:700, padding:"8px 18px", cursor:"pointer"}}>Add →</button>
              </div>
            </div>
          )}

          {customStores.length > 0 ? (
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8}}>
              {customStores.map(store => {
                const active = mallIds.has(store.id);
                return (
                  <div key={store.id} style={{borderRadius:12, padding:"13px 12px", border:`1.5px solid ${active ? store.color : C.border}`, background: active ? `${store.color}08` : C.surface, position:"relative"}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}>
                      <div onClick={() => toggleStore(store.id)} style={{width:24, height:24, borderRadius:"50%", background:store.color, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>
                        {active && <span style={{color:"#fff", fontSize:11}}>✓</span>}
                      </div>
                      <button onClick={() => removeCustom(store.id)} style={{background:"none", border:"none", color:C.muted, fontSize:16, cursor:"pointer", padding:0}}>×</button>
                    </div>
                    <div onClick={() => toggleStore(store.id)} style={{cursor:"pointer"}}>
                      <div style={{fontSize:12, fontWeight:700, color:C.text, marginBottom:1}}>{store.name}</div>
                      <div style={{fontSize:10, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{store.url}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !showAddForm && (
            <div style={{textAlign:"center", padding:"24px", background:C.light, borderRadius:12, border:`1.5px dashed ${C.border}`}}>
              <div style={{fontSize:12, color:C.muted}}>Add stores that aren't on our vetted list yet.</div>
            </div>
          )}
        </div>

        <div style={{padding:"13px 16px", borderRadius:12, background:"#FFF7F0", border:"1px solid #F0D5C0", fontSize:12, color:C.muted, lineHeight:1.6}}>
          🔒 <strong style={{color:C.text}}>Vestiary-vetted stores</strong> are pre-approved retailers. Custom stores are your own picks.
        </div>
      </div>
    );
  }

  if (section === "icons") {
    const icons = [
      {id:1, name:"Jeanne Damas", handle:"@jeannedamas", note:"Parisian effortless", avatar:palette[0]},
      {id:2, name:"Pernille Teisbaek", handle:"@pernilleteisbaek", note:"Scandinavian minimal", avatar:palette[2]},
      {id:3, name:"Sofia Coelho", handle:"@sofiacoelho", note:"Contemporary luxe", avatar:palette[4]},
    ];
    const [followed, setFollowed] = useState(new Set([1]));
    return (
      <div>
        <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:24}}>
          <button onClick={() => setSection(null)} style={{background:C.light, border:"none", borderRadius:20, padding:"7px 14px", fontSize:12, fontWeight:700, color:C.muted, cursor:"pointer"}}>← Back</button>
          <div>
            <div style={{fontSize:22, fontWeight:800, fontFamily:"'Cormorant Garamond',serif", color:C.text}}>Style Icons</div>
            <div style={{fontSize:12, color:C.muted, marginTop:2}}>Optional — follow public closets for inspiration.</div>
          </div>
        </div>
        <div style={{background:C.purple, border:`1px solid ${C.purpleBorder}`, borderRadius:12, padding:"11px 15px", marginBottom:20, fontSize:12, color:C.muted, lineHeight:1.6}}>
          💡 You only see their public closets. Your own closets stay completely private.
        </div>
        {icons.map(u => (
          <div key={u.id} style={{display:"flex", alignItems:"center", gap:12, background:C.surface, borderRadius:14, padding:"13px 15px", border:`1px solid ${C.border}`, marginBottom:8}}>
            <div style={{width:40, height:40, borderRadius:"50%", background:u.avatar, flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13, fontWeight:700, color:C.text}}>{u.name}</div>
              <div style={{fontSize:11, color:C.muted}}>{u.handle} · {u.note}</div>
            </div>
            <button onClick={() => setFollowed(f => { const n = new Set(f); n.has(u.id) ? n.delete(u.id) : n.add(u.id); return n; })} style={{
              background: followed.has(u.id) ? C.light : C.accent, border:"none", borderRadius:20,
              color: followed.has(u.id) ? C.muted : "#fff", fontSize:11, fontWeight:700,
              padding:"7px 14px", cursor:"pointer", flexShrink:0,
            }}>{followed.has(u.id) ? "Following" : "Follow"}</button>
          </div>
        ))}
      </div>
    );
  }

  // Profile home
  const MENU = [
    { id:"mall",  label:"My Mall",     sub: mallIds.size > 0 ? `${mallIds.size} stores active` : "Set up your stores", icon:"🏪" },
    { id:"icons", label:"Style Icons", sub:"Follow public closets for inspiration",                                     icon:"✦" },
  ];

  return (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{fontSize:28, fontWeight:800, fontFamily:"'Cormorant Garamond',serif", color:C.text}}>Profile</div>
      </div>

      {/* Avatar */}
      <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:32, padding:"20px", background:C.surface, borderRadius:16, border:`1px solid ${C.border}`}}>
        <div style={{width:56, height:56, borderRadius:"50%", background:palette[0], flexShrink:0}}/>
        <div>
          <div style={{fontSize:16, fontWeight:800, color:C.text, fontFamily:"'Cormorant Garamond',serif"}}>Your Name</div>
          <div style={{fontSize:12, color:C.muted, marginTop:2}}>@yourhandle</div>
        </div>
      </div>

      {/* Menu */}
      <div style={{display:"flex", flexDirection:"column", gap:8}}>
        {MENU.map(item => (
          <button key={item.id} onClick={() => setSection(item.id)} style={{
            display:"flex", alignItems:"center", gap:14,
            background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:14, padding:"16px 18px", cursor:"pointer",
            textAlign:"left", transition:"box-shadow 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.07)"}
          onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
            <span style={{fontSize:20, flexShrink:0}}>{item.icon}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14, fontWeight:700, color:C.text}}>{item.label}</div>
              <div style={{fontSize:12, color:C.muted, marginTop:2}}>{item.sub}</div>
            </div>
            <span style={{color:C.muted, fontSize:16}}>›</span>
          </button>
        ))}
      </div>

      <div style={{marginTop:24, padding:"13px 16px", borderRadius:12, background:C.purple, border:`1px solid ${C.purpleBorder}`, fontSize:12, color:C.muted, lineHeight:1.6}}>
        🔒 <strong style={{color:C.text}}>Your closets are private by default.</strong> Nothing is visible to anyone unless you choose to make a specific closet public.
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("explore");
  const [mallIds, setMallIds] = useState(new Set());
  const [customStores, setCustomStores] = useState([]);
  const [closets, setClosets] = useState(DEFAULT_CLOSETS);
  const [savedIds, setSavedIds] = useState(new Set());
  const [pickerItem, setPickerItem] = useState(null);

  const handleSaveClick = (item) => setPickerItem(item);

  const handleSaveToCloset = (closetId) => {
    setClosets(prev => prev.map(c =>
      c.id === closetId ? {...c, items: [...c.items, pickerItem]} : c
    ));
    setSavedIds(prev => new Set([...prev, pickerItem.id]));
    setPickerItem(null);
  };

  const NAV = [
    { id:"explore", label:"Explore", icon:"✦" },
    { id:"closets", label:"Closets", icon:"○" },
    { id:"profile", label:"Profile", icon:"◆" },
  ];

  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", color:C.text}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input,textarea{color:#000000 !important;-webkit-text-fill-color:#000000 !important;caret-color:#000000 !important;opacity:1 !important;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:#D5CFC8;border-radius:99px;}
        button{font-family:inherit;}
        input::placeholder{color:#B0A89E !important;-webkit-text-fill-color:#B0A89E !important;}
      `}</style>

      {pickerItem && <SavePicker item={pickerItem} closets={closets} onSave={handleSaveToCloset} onClose={() => setPickerItem(null)}/>}

      {/* Header — minimal */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(247,245,242,0.95)", backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${C.border}`, padding:"14px 24px",
      }}>
        <div style={{maxWidth:1400, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div style={{fontSize:22, fontWeight:800, fontFamily:"'Cormorant Garamond',serif", letterSpacing:"-0.02em", lineHeight:1}}>
          <span style={{color:C.warm}}>Fitted</span>
          </div>

          {/* Nav — centered */}
          <div style={{display:"flex", gap:2}}>
            {NAV.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:"8px 20px", borderRadius:20, border:"none",
                background: tab === t.id ? C.accent : "transparent",
                color: tab === t.id ? "#fff" : C.muted,
                fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.18s",
              }}>{t.label}</button>
            ))}
          </div>

          <div style={{width:34, height:34, borderRadius:"50%", background:palette[0], border:`2px solid ${C.border}`, cursor:"pointer"}}/>
        </div>
      </div>

      {/* Body */}
      <div style={{maxWidth:1400, margin:"0 auto", padding:"24px 24px"}}>
        {tab === "explore" && <ExploreScreen mallIds={mallIds} savedIds={savedIds} closets={closets} onSaveClick={handleSaveClick}/>}
        {tab === "closets" && <ClosetsScreen closets={closets} setClosets={setClosets}/>}
        {tab === "profile" && <ProfileScreen mallIds={mallIds} setMallIds={setMallIds} customStores={customStores} setCustomStores={setCustomStores}/>}
      </div>
    </div>
  );
}
