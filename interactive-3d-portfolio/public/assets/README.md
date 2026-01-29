# Assets for interactive-3d-portfolio

Copy these files from the parent repo `src/assets/` into this folder:

- **KakaoTalk_20250708_231845951.jpg** — profile image (Hero)
- **falling-stars-stars.gif** — profile background (Hero)
- **sensor_dashboard.png** — project image
- **scm_app.png** — project image
- **pixel_art.jpeg** — project image

From PowerShell (run from repo root):

```powershell
$src = "src\assets"
$dst = "interactive-3d-portfolio\public\assets"
Copy-Item "$src\KakaoTalk_20250708_231845951.jpg" $dst
Copy-Item "$src\falling-stars-stars.gif" $dst
Copy-Item "$src\sensor_dashboard.png" $dst
Copy-Item "$src\scm_app.png" $dst
Copy-Item "$src\pixel_art.jpeg" $dst
```

Optional: **AIx-decision-second-20260115.mp4** — place in `public/videos/` if you add a video project card.
