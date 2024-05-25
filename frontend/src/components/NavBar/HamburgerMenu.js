export default function HamburgerMenu() {
  return (
    <div class="card hamburger-card">
      <header class="card-header hamburger-card-header">
        <p class="card-header-title">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-hand-sparkles"></i>
            </span>
            <span>Hi, Firstname!</span>
          </span>
        </p>
      </header>
      <div class="card-content">
        <div class="content">
          <p>Firstname Lastname</p>
          <p>user@gmail.com</p>
        </div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item">
          Settings
        </a>
        <a href="#" class="card-footer-item">
          Log out
        </a>
      </footer>
    </div>
  );
}
