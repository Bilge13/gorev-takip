# Görev Takip

React + Vite ile yazılmış CRUD uygulaması.

- **Read:** İlk açılışta görevler JSONPlaceholder API'den çekilir ve `localStorage`'a kaydedilir.
- **Create:** Form ile yeni görev eklenir, `localStorage` güncellenir.
- **Update:** Görev başlığı düzenlenebilir, tamamlandı olarak işaretlenebilir.
- **Delete:** Görev listeden ve `localStorage`'tan silinir.

## Çalıştırma
```
npm install
npm run dev
```

## Yayın
Netlify: build komutu `npm run build`, yayın klasörü `dist` (netlify.toml içinde tanımlı).
