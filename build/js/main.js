
'use strict';
var body = document.querySelector('body');

// burger
var setBurger = function () {
  var pageHeader = document.querySelector('.header');
  pageHeader.classList.add('header--js');
  var headerToggle = document.querySelector('.header__menu-btn');

  headerToggle.addEventListener('click', function () {
    if (pageHeader.classList.contains('header--js')) {
      pageHeader.classList.add('header--open');
      body.classList.add('lock');
    } else {
      pageHeader.classList.remove('header--open');
      body.classList.remove('lock');
    }
    pageHeader.classList.toggle('header--js');
  });
};

if (document.querySelector('.header')) {
  setBurger();
}

// modals
var setPopupLogin = function () {
  var modalLogin = document.querySelector('.login');
  var close = document.querySelector('.login__close');
  var openLogin = document.querySelectorAll('.login-link');
  var inputFocus = document.querySelector('.login__email');
  var targetEl = document.querySelector('.login__wrap');

  var popupEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeModalLogin();
    }
  };

  var openModal = function () {
    modalLogin.classList.remove('hidden');

    body.classList.add('lock');
    inputFocus.focus();

    document.addEventListener('keydown', popupEscPressHandler);
  };

  openLogin.forEach(function (element) {
    element.setAttribute('href', '#');
    element.addEventListener('click', openModal);
  });


  var closeModalLogin = function () {
    modalLogin.classList.add('hidden');

    body.classList.remove('lock');
    document.removeEventListener('keydown', popupEscPressHandler);
  };

  close.addEventListener('click', function () {
    closeModalLogin();
  });

  modalLogin.addEventListener('click', function (e) {
    if (e.target !== targetEl) {
      return;
    } else {
      closeModalLogin();
    }
  });
};

if (document.querySelector('.login')) {
  setPopupLogin();
}

var setPopupCheck = function () {
  var modalCheck = document.querySelector('.check');
  var openCheck = document.querySelectorAll('.product-card__button');
  var close = document.querySelector('.check__close');
  var plus = document.querySelector('.check__plus');

  var targetCheck = document.querySelector('.check__wrap');

  var popupEscPressHandler = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeModalCheck();
    }
  };

  var openModalCheck = function () {
    modalCheck.classList.remove('hidden');
    body.classList.add('lock');
    plus.focus();
    document.addEventListener('keydown', popupEscPressHandler);
  };

  openCheck.forEach(function (element) {
    element.setAttribute('href', '#');
    element.addEventListener('click', openModalCheck);
  });


  var closeModalCheck = function () {
    modalCheck.classList.add('hidden');

    body.classList.remove('lock');
    document.removeEventListener('keydown', popupEscPressHandler);
  };

  close.addEventListener('click', function () {
    closeModalCheck();
  });

  modalCheck.addEventListener('click', function (e) {
    if (e.target !== targetCheck) {
      return;
    } else {
      closeModalCheck();
    }
  });
};

if (document.querySelector('.check')) {
  setPopupCheck();
}

// localStorage
var subPopup = function () {
  var loginForm = document.querySelector('.login__form');
  var email = loginForm.querySelector('.login__email');


  var isStorageSupport = true;

  try {
    localStorage.getItem('email');
  } catch (err) {
    isStorageSupport = false;
  }

  var subPopupHandler = function () {
    if (isStorageSupport) {
      localStorage.setItem('email', email.value);
    }
  };

  loginForm.addEventListener('submit', subPopupHandler);
};

if (document.querySelector('.login')) {
  subPopup();
}


// filter
var checkFilter = function () {
  var filter = document.querySelector('.catalog__aside-btn');
  var aside = document.querySelector('.aside');
  var asideClose = document.querySelector('.aside__close');
  aside.classList.add('aside--js');

  filter.addEventListener('click', function () {
    aside.classList.remove('aside--js');
    aside.classList.add('aside--active');
    body.classList.add('lock');
  });

  asideClose.addEventListener('click', function () {
    aside.classList.remove('aside--active');
    aside.classList.add('aside--js');
    body.classList.remove('lock');
  });
};

if (document.querySelector('.aside')) {
  checkFilter();
}

// accordion
var setAccordion = function () {
  var accordionList = document.querySelector('.accordion__list');
  accordionList.classList.add('accordion__list--js');

  document.querySelectorAll('.accordion__btn').forEach(function (item) {
    item.addEventListener('click', function () {
      var parent = item.parentNode;

      if (parent.classList.contains('accordion__item--active')) {
        parent.classList.remove('accordion__item--active');
      } else {
        document.querySelectorAll('.accordion__item').forEach(function (child) {
          child.classList.remove('accordion__item--active');
        });

        parent.classList.toggle('accordion__item--active');
      }
    });
  });
};

if (document.querySelector('.accordion')) {
  setAccordion();
}

// tabs
var setTab = function () {
  var tabNav = document.querySelectorAll('.tabs__item');
  var tabContent = document.querySelectorAll('.tabs__inset');
  var tabName;

  tabNav.forEach(function (item) {
    item.addEventListener('click', selectTabNav);
  });

  function selectTabNav(e) {
    tabNav.forEach(function (item) {
      item.classList.remove('tabs__item--active');
    });

    e.currentTarget.classList.add('tabs__item--active');
    tabName = e.currentTarget.getAttribute('data-tab-name');
    selectTabContent(tabName);
  }

  function selectTabContent(tabN) {
    tabContent.forEach(function (item) {
      if (item.classList.contains(tabN)) {
        item.classList.add('tabs__inset--active');
      } else {
        item.classList.remove('tabs__inset--active');
      }
    });
  }
};

if (document.querySelector('.tabs')) {
  setTab();
}
