import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=8";
const STORAGE_KEY = "gorevler";

// localStorage okuma/yazma (hata olursa uygulama çökmesin)
const oku = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
};
const yaz = (liste) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(liste));
  } catch {}
};

export default function App() {
  const [gorevler, setGorevler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");
  const [baslik, setBaslik] = useState("");
  const [duzenlenenId, setDuzenlenenId] = useState(null);

  // READ: önce localStorage, yoksa uzak API'den çek ve kaydet
  useEffect(() => {
    const kayitli = oku();
    if (kayitli) {
      setGorevler(kayitli);
      setYukleniyor(false);
      return;
    }
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((veri) => {
        const liste = veri.map(({ id, title, completed }) => ({ id, title, completed }));
        setGorevler(liste);
        yaz(liste);
      })
      .catch(() => setHata("Görevler yüklenemedi. Sayfayı yenileyip tekrar deneyin."))
      .finally(() => setYukleniyor(false));
  }, []);

  // Her değişiklikte hem state hem localStorage güncellenir
  const guncelle = (liste) => {
    setGorevler(liste);
    yaz(liste);
  };

  // CREATE + UPDATE (başlık düzenleme)
  const kaydet = (e) => {
    e.preventDefault();
    const temiz = baslik.trim();
    if (!temiz) return;
    if (duzenlenenId !== null) {
      guncelle(gorevler.map((g) => (g.id === duzenlenenId ? { ...g, title: temiz } : g)));
      setDuzenlenenId(null);
    } else {
      guncelle([{ id: Date.now(), title: temiz, completed: false }, ...gorevler]);
    }
    setBaslik("");
  };

  // UPDATE (tamamlandı işareti)
  const degistir = (id) =>
    guncelle(gorevler.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));

  // DELETE
  const sil = (id) => {
    guncelle(gorevler.filter((g) => g.id !== id));
    if (duzenlenenId === id) {
      setDuzenlenenId(null);
      setBaslik("");
    }
  };

  const duzenle = (g) => {
    setDuzenlenenId(g.id);
    setBaslik(g.title);
  };

  const iptal = () => {
    setDuzenlenenId(null);
    setBaslik("");
  };

  const sifirla = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.location.reload();
  };

  const biten = gorevler.filter((g) => g.completed).length;

  return (
    <main className="sayfa">
      <header>
        <h1>Görev Takip</h1>
        <p className="ozet">
          {gorevler.length} görev, {biten} tamamlandı
        </p>
      </header>

      <form onSubmit={kaydet} className="form">
        <input
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="Yeni görev yazın"
          aria-label="Görev başlığı"
        />
        <button type="submit" className="birincil">
          {duzenlenenId !== null ? "Değişikliği kaydet" : "Görev ekle"}
        </button>
        {duzenlenenId !== null && (
          <button type="button" onClick={iptal}>
            Vazgeç
          </button>
        )}
      </form>

      {yukleniyor && <p className="bilgi">Görevler yükleniyor…</p>}
      {hata && <p className="bilgi hata">{hata}</p>}
      {!yukleniyor && !hata && gorevler.length === 0 && (
        <p className="bilgi">Henüz görev yok. Yukarıdan ilkini ekleyin.</p>
      )}

      <ul className="liste">
        {gorevler.map((g) => (
          <li key={g.id} className={g.completed ? "bitti" : ""}>
            <label>
              <input type="checkbox" checked={g.completed} onChange={() => degistir(g.id)} />
              <span>{g.title}</span>
            </label>
            <div className="islemler">
              <button onClick={() => duzenle(g)}>Düzenle</button>
              <button className="tehlike" onClick={() => sil(g.id)}>
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      <footer>
        <button className="link" onClick={sifirla}>
          Verileri sıfırla ve API'den yeniden yükle
        </button>
      </footer>
    </main>
  );
}
