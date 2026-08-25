import { downloadHref, release } from "./site-content.mjs";

const privacyItems = [
  "Исправление и распознавание речи работают локально на Mac.",
  "Нажатия клавиш и полный текст полей не сохраняются.",
  "Нет аналитики, облачного API и отправки текста на сервер.",
  "Защищённые поля исключаются из обработки.",
];

/// `base` is a parameter because Vite rewrites BASE_URL to "/" in the SSR build used by
/// the prerender step, which would bake an absolute link the Pages subpath cannot serve.
function App({ base = import.meta.env.BASE_URL }: { base?: string }) {
  const href = downloadHref(base);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="LangFlip: к началу страницы">
            <img src="./langflip-icon.png" alt="Иконка приложения LangFlip" width="42" height="42" />
            <span>LangFlip</span>
          </a>
          <nav className="header-nav" aria-label="Основная навигация">
            <a href="#features">Возможности</a>
            <a href="#privacy">Приватность</a>
            <a href="#install">Установка</a>
            <a href="/docs/">Документация</a>
          </nav>
          <a className="header-download" href={href} download>
            Скачать
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="product-badge">
              <img src="./langflip-icon.png" alt="Иконка LangFlip для macOS" width="48" height="48" />
              <div>
                <strong>LangFlip</strong>
                <span>Бесплатно для macOS</span>
              </div>
            </div>
            <p className="eyebrow">Аналог Punto Switcher для macOS</p>
            <h1 id="hero-title">Исправляет раскладку, пока вы печатаете.</h1>
            <p className="hero-description">
              LangFlip замечает слова в неправильной раскладке, исправляет их автоматически
              и по двойному нажатию <span className="keyboard-key">⌘</span>. Автопереключение
              раскладки и диктовка работают локально на Mac и включаются по желанию.
            </p>
            <a className="download-button" href={href} download>
              Скачать LangFlip {release.version}
              <span aria-hidden="true">↓</span>
            </a>
            <p className="release-note">
              {release.macOS} <span aria-hidden="true">·</span> DMG <span aria-hidden="true">·</span>{" "}
              около {release.sizeLabel}
            </p>
          </div>

          <div
            className="conversion-demo"
            aria-label="Демонстрация исправления раскладки: ghbdtn превращается в привет по двойному нажатию Command"
          >
            <div className="conversion-glow" aria-hidden="true" />
            <div className="command-orbit" aria-hidden="true">
              <span>⌘</span>
              <span>⌘</span>
            </div>
            <div className="conversion-word conversion-before">
              <span>До</span>
              <strong>ghbdtn</strong>
            </div>
            <div className="conversion-pulse" aria-hidden="true">
              <i />
              <span>→</span>
              <i />
            </div>
            <div className="conversion-word conversion-after">
              <span>После</span>
              <strong>привет</strong>
            </div>
            <div className="dictation-chip">
              <span className="dictation-dot" aria-hidden="true" />
              Диктовка готова — удерживайте <span className="keyboard-key">⌘</span>
            </div>
          </div>
        </section>

        <section className="features section-shell" id="features" aria-labelledby="features-title">
          <div className="section-heading">
            <p className="eyebrow">Три способа писать быстрее</p>
            <h2 id="features-title">Не отвлекайтесь от мысли</h2>
            <p>LangFlip берёт на себя раскладку и ввод — незаметно, когда не нужен, и всегда под рукой.</p>
          </div>
          <div className="feature-grid">
            <article className="feature-card feature-card--blue">
              <span className="feature-number" aria-hidden="true">01</span>
              <div className="feature-icon" aria-hidden="true">А↔A</div>
              <h3>Исправляет автоматически</h3>
              <p>Распознаёт слово в неправильной русской или английской раскладке и заменяет его на верное.</p>
            </article>
            <article className="feature-card feature-card--violet">
              <span className="feature-number" aria-hidden="true">02</span>
              <div className="feature-icon feature-keys" aria-hidden="true">
                <span>⌘</span><span>⌘</span>
              </div>
              <h3>Переключает вручную</h3>
              <p>
                Дважды нажмите <span className="keyboard-key">⌘</span>, чтобы преобразовать последнее слово.
                Если передумали — <span className="keyboard-key">⌥⌘Z</span>.
              </p>
            </article>
            <article className="feature-card feature-card--periwinkle">
              <span className="feature-number" aria-hidden="true">03</span>
              <div className="feature-icon" aria-hidden="true">●)))</div>
              <h3>Диктуйте в любое окно</h3>
              <p>Удерживайте ⌘ и говорите: текст появится в активном поле любого приложения.</p>
            </article>
          </div>
        </section>

        <section className="dictation section-shell" aria-labelledby="dictation-title">
          <div className="dictation-copy">
            <p className="eyebrow">Локальная диктовка</p>
            <h2 id="dictation-title">Голос превращается в текст прямо на Mac</h2>
            <p>
              Распознавание работает через <strong>WhisperKit</strong> на Neural Engine — процессоре,
              который есть в каждом Mac на Apple Silicon. Функция включается по желанию, а модель
              размером около <strong>626 МБ</strong> загружается один раз отдельно.
            </p>
          </div>
          <ol className="dictation-steps" aria-label="Как пользоваться диктовкой">
            <li><span>1</span><strong>Удерживайте</strong><small>клавишу ⌘</small></li>
            <li><span>2</span><strong>Говорите</strong><small>в обычном темпе</small></li>
            <li><span>3</span><strong>Отпустите</strong><small>текст появится в поле</small></li>
          </ol>
        </section>

        <section className="privacy" id="privacy" aria-labelledby="privacy-title">
          <div className="privacy-inner">
            <div className="privacy-intro">
              <p className="eyebrow">Приватность по умолчанию</p>
              <h2 id="privacy-title">Ваш текст не покидает Mac</h2>
              <p>Никаких аккаунтов и скрытой отправки данных. Только локальная обработка.</p>
            </div>
            <ul className="privacy-list">
              {privacyItems.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="install section-shell" id="install" aria-labelledby="install-title">
          <div className="section-heading install-heading">
            <p className="eyebrow">Четыре шага</p>
            <h2 id="install-title">Установите и продолжайте печатать</h2>
            <p>Текущая сборка имеет developer-подпись, но пока не нотаризована Apple.</p>
          </div>
          <ol className="install-steps">
            <li>
              <span className="step-number">01</span>
              <div><h3>Перенесите приложение</h3><p>Откройте DMG и перетащите LangFlip в папку Applications.</p></div>
            </li>
            <li>
              <span className="step-number">02</span>
              <div><h3>Откройте через меню</h3><p>При первом запуске нажмите Правой кнопкой → Открыть и подтвердите запуск.</p></div>
            </li>
            <li>
              <span className="step-number">03</span>
              <div>
                <h3>Разрешите доступ</h3>
                <p>Включите Input Monitoring и Accessibility. Микрофон нужен только для диктовки.</p>
              </div>
            </li>
            <li>
              <span className="step-number">04</span>
              <div><h3>Выберите раскладки</h3><p>Укажите русскую и английскую раскладки и при желании загрузите речевую модель.</p></div>
            </li>
          </ol>
        </section>

        <section className="final-cta" aria-labelledby="download-title">
          <div className="final-cta-art" aria-hidden="true">
            <span className="final-command">⌘</span>
            <div className="final-conversion">
              <span>ghbdtn</span>
              <i>→</i>
              <strong>привет</strong>
            </div>
          </div>
          <div className="final-cta-copy">
            <p className="eyebrow">Готово к работе</p>
            <h2 id="download-title">Печатайте на двух языках без лишних переключений</h2>
            <p>Бесплатно. Без подписки. Данные остаются на Mac.</p>
            <a className="download-button download-button--dark" href={href} download>
              Скачать LangFlip {release.version}
              <span aria-hidden="true">↓</span>
            </a>
            <small>{release.macOS} · около {release.sizeLabel}</small>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top" aria-label="LangFlip: к началу страницы">
          <img src="./langflip-icon.png" alt="Иконка приложения LangFlip" width="36" height="36" />
          <span>LangFlip</span>
        </a>
        <p>Версия {release.version}</p>
        <nav aria-label="Ссылки проекта">
          <a href="/docs/">Документация</a>
          <a href="#privacy">Приватность</a>
          <a href="#install">Установка</a>
        </nav>
      </footer>
    </>
  );
}

export default App;
