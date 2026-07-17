document.addEventListener('DOMContentLoaded', function() {
  // ... h3 animation code ...

  // Animate dynamicSubtitle element
  const dynamicSubtitle = document.getElementById('dynamicSubtitle');
  dynamicSubtitle.style.transition = 'opacity 1s';
  let texts = ["Data Modeling & Warehousing", "Analytics Engineering", "BI & Dashboards", "AI & Automation"];
  let index = 0;

  const changeText = () => {
      dynamicSubtitle.classList.add('fade-out');
      dynamicSubtitle.addEventListener('transitionend', function() {
          dynamicSubtitle.textContent = texts[index++ % texts.length];
          dynamicSubtitle.classList.remove('fade-out');
          dynamicSubtitle.classList.add('fade-in');
      }, { once: true });
  };

  setTimeout(changeText, 500);
  setInterval(changeText, 1000+1500); // 2000 for fade in and out duration
});

// ... Button Scroll ... //
document.addEventListener('DOMContentLoaded', (event) => {
    const navbarLinks = document.querySelectorAll('ul.navbar a');

    navbarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the href attribute is an anchor link (starts with #)
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault(); // Prevent default only for anchor links

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
// ------- Contact form (Web3Forms) ------- //
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    if (!form) return;
    const submitBtn = form.querySelector('button[type=submit]');
    const successMsg = form.querySelector('.form-messages.success');
    const errorMsg = form.querySelector('.form-messages.error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        // Require the hCaptcha to be solved before sending (Web3Forms verifies it)
        const token = form.querySelector('[name=h-captcha-response]')?.value;
        if (!token) {
            errorMsg.textContent = 'Please complete the security check.';
            errorMsg.style.display = 'block';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(form))),
            });
            const out = await res.json();
            if (out.success) {
                form.reset();
                successMsg.style.display = 'block';
            } else {
                errorMsg.textContent = out.message || 'Something went wrong — please try again.';
                errorMsg.style.display = 'block';
            }
        } catch {
            errorMsg.textContent = 'Network error — please try again or email me directly.';
            errorMsg.style.display = 'block';
        } finally {
            if (window.hcaptcha) window.hcaptcha.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
        }
    });
});

// ------- Active navbar on scroll ------- //
(function () {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const active = document.querySelector(`.navbar a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.4, rootMargin: '-10% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
})();

// ------- Hamburger menu ------- //
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('open');
        });
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navbar.classList.remove('open'));
        });
    }
});

// ------- Scroll to top ------- //
(function () {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();


