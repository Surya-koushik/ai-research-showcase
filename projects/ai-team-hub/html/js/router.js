class Router {
  constructor() {
    this._routes = {};
    this._current = null;
    window.addEventListener('hashchange', () => this.resolve());
  }

  on(path, handler) { this._routes[path] = handler; }

  navigate(path) {
    window.location.hash = '#' + path;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    const [path, ...params] = hash.split('/');
    if (this._routes[path]) {
      this._current = path;
      this._routes[path](params.join('/'));
    }
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.classList.toggle('active', el.dataset.nav === path);
    });
  }

  get current() { return this._current; }
}

export const router = new Router();
