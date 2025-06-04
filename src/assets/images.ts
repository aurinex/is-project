// Изображения для главной страницы
export const images = {
  // Фоновые изображения для секций
  hero: {
    background: '/images/hero-bg.jpg',
    shield: '/images/shield-3d.png',
    lock: '/images/lock-3d.png',
    computer: '/images/secure-computer.png',
  },
  
  // Иконки для модулей
  modules: {
    basicSecurity: '/images/basic-security-icon.png',
    passwordSecurity: '/images/password-security-icon.png',
    phishing: '/images/phishing-icon.png',
    workplaceSecurity: '/images/workplace-security-icon.png',
  },
  
  // Изображения для секции особенностей
  features: {
    interactive: '/images/interactive-learning.png',
    certificate: '/images/certificate.png',
    progress: '/images/progress-tracking.png',
  },
  
  // Изображения для секции статистики
  stats: {
    dataBreaches: '/images/data-breach.png',
    phishingAttacks: '/images/phishing-attack.png',
    passwordTheft: '/images/password-theft.png',
  }
};

// Заглушки для изображений (base64 или URL)
export const placeholderImages = {
  hero: {
    background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
    shield: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAxTDMgNXYxNGwxOC0xMFYxTDEyIDF6Ii8+PC9zdmc+',
    lock: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xOCA4aC0xVjZjMC0yLjc2LTIuMjQtNS01LTUzNyAzLjI0IDcgNnYySDZjLTEuMSAwLTIgLjktMiAydjEwYzAgMS4xLjkgMiAyIDJoMTJjMS4xIDAgMi0uOSAyLTJWMTBjMC0xLjEtLjktMi0yLTJ6bS02IDlhMyAzIDAgMSAxIDAtNiAzIDMgMCAwIDEgMCA2em0zLTloLTZWNmMwLTEuNjYgMS4zNC0zIDMtM3MzIDEuMzQgMyAzdjJ6Ii8+PC9zdmc+',
    computer: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0yMCA0SDRjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJWNmMwLTEuMS0uOS0yLTItMnptLTUgMTRIN3YtMmg4djJ6bTItNEg3di0yaDEwdjJ6bTAtNEg3VjhoMTB2MnoiLz48L3N2Zz4=',
  },
  
  modules: {
    basicSecurity: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQzNjFlZSI+PHBhdGggZD0iTTEyIDFMMyA1djZjMCA1LjU1IDMuODQgMTAuNzQgOSAxMiA1LjE2LTEuMjYgOS02LjQ1IDktMTJWNWwtOS00em0wIDEwLjk5aDdjLS41MyA0LjEyLTMuMjggNy43OS03IDguOTRWMTJIMVY2LjNsOC0zLjRWMTJoM3YtLjAxeiIvPjwvc3ZnPg==',
    passwordSecurity: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzNhMGNhMyI+PHBhdGggZD0iTTE4IDhoLTFWNmMwLTIuNzYtMi4yNC01LTUtNVM3IDMuMjQgNyA2djJINmMtMS4xIDAtMiAuOS0yIDJ2MTBjMCAxLjEuOSAyIDIgMmgxMmMxLjEgMCAyLS45IDItMlYxMGMwLTEuMS0uOS0yLTItMnptLTYgOWEzIDMgMCAxIDEgMC02IDMgMyAwIDAgMSAwIDZ6bTMtOWgtNlY2YzAtMS42NiAxLjM0LTMgMy0zczMgMS4zNCAzIDN2MnoiLz48L3N2Zz4=',
    phishing: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRjYzlmMCI+PHBhdGggZD0iTTE1LjczIDNINy4yN0w1LjI0IDZoMTMuNTJsLTMuMDMtM3pNMjEgNmgtMmwtMS44My0ySDYuODNMNSA2SDNDN3YxMmgydjJoMTB2LTJoMlY2aC0yeiIvPjwvc3ZnPg==',
    workplaceSecurity: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRhZGU4MCI+PHBhdGggZD0iTTEwIDEwdjJINnYtMmg0em0wLTR2MmgtNFY2aDR6bTAgOHYySDZ2LTJoNHptNi0xMmgtNHYyaDR2MTBINnYyaC00di0yVjRjMC0xLjEuOS0yIDItMmgxMmMxLjEgMCAyIC45IDIgMnYxNGMwIDEuMS0uOSAyLTIgMmgtNHYtMmg0VjRoLTR6Ii8+PC9zdmc+',
  },
  
  features: {
    interactive: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzQzNjFlZSI+PHBhdGggZD0iTTE4IDRINmMtMS4xIDAtMiAuOS0yIDJ2MTJjMCAxLjEuOSAyIDIgMmgxMmMxLjEgMCAyLS45IDItMlY2YzAtMS4xLS45LTItMi0yek03IDE5SDV2LTJoMnYyem0wLTRINXYtMmgydjJ6bTAtNEg1VjloMnYyem0wLTRINVY1aDJ2MnptMTAgMTJoLTh2LTJoOHYyem0wLTRoLTh2LTJoOHYyem0wLTRoLTh2LTJoOHYyem0wLTRoLTh2LTJoOHYyeiIvPjwvc3ZnPg==',
    certificate: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzNhMGNhMyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0yIDE1bC01LTUgMS40MS0xLjQxTDEwIDE0LjE3bDcuNTktNy41OUwxOSA4bC05IDl6Ii8+PC9zdmc+',
    progress: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzRjYzlmMCI+PHBhdGggZD0iTTE5IDNINWMtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxNGMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0tNSAxNGgtMnYtNGgydjR6bTAtNmgtMlY3aDJ2NHoiLz48L3N2Zz4=',
  },
  
  stats: {
    dataBreaches: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2Y3MjU4NSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTEgMTVoLTJ2LTZoMnY2em0wLThoLTJ2LTJoMnYyeiIvPjwvc3ZnPg==',
    phishingAttacks: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZiODUwMCI+PHBhdGggZD0iTTEgMjFoMjJMMTIgMiAxIDIxem0xMi0zaC0ydi0yaDJ2MnptMC00aC0ydi00aDJ2NHoiLz48L3N2Zz4=',
    passwordTheft: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzNhODZmZiI+PHBhdGggZD0iTTEwLjA5IDE1LjU5TDExLjUgMTdsNS0xNS01IDE1ek0xNy4wMSAxM2MtLjU5IDAtMS4wNS40Ny0xLjA1IDEuMDUgMCAuNTkuNDcgMS4wNCAxLjA1IDEuMDQuNTkgMCAxLjA0LS40NSAxLjA0LTEuMDQgMC0uNTgtLjQ0LTEuMDUtMS4wNC0xLjA1eiIvPjwvc3ZnPg==',
  }
}; 