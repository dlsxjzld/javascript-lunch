var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Component {
  constructor($target, props) {
    __publicField(this, "$target");
    __publicField(this, "props");
    __publicField(this, "state", {});
    this.$target = $target;
    this.props = props;
    this.setup();
    this.initialRender();
  }
  setup() {
  }
  render() {
    this.$target.insertAdjacentHTML("afterbegin", this.template());
  }
  initialRender() {
    this.render();
    this.componentDidMount();
  }
  componentDidMount() {
  }
  componentDidUpdate() {
  }
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.componentDidUpdate();
  }
  template() {
    return "";
  }
}
const $ = ($target = document, selector) => {
  return $target.querySelector(selector);
};
class Header extends Component {
  template() {
    const { title, ariaLabel, dataTestId, iconImageSource, alt } = this.props.data;
    return (
      /*html*/
      `
      <header class="gnb">
        <h1 class="gnb__title text-title">${title}</h1>
        <button type="button" class="gnb__button" aria-label=${ariaLabel} data-testid=${dataTestId}>
          <img src=${iconImageSource} alt=${alt}>
        </button>
      </header>
    `
    );
  }
  componentDidMount() {
    const buttonCallback = this.props.buttonCallback;
    const $gnbButton = $(document, ".gnb__button");
    $gnbButton.addEventListener("click", buttonCallback);
  }
}
class TabNavigation extends Component {
  setup() {
    this.state = {
      activeTab: "all"
    };
  }
  template() {
    return (
      /*html*/
      `
      <div id='tab-navigation' class="tab-navigation">
        <button id='all-tab' class="tab ${this.state.activeTab === "all" ? "active" : ""}" data-tab="all" data-testid="all-tab">모든 음식점</button>
        <button id='favorite-tab' class="tab ${this.state.activeTab === "favorite" ? "active" : ""}" data-tab="favorite" data-testid="favorite-tab">자주 가는 음식점</button>
      </div>
    `
    );
  }
  componentDidMount() {
    const $tabNavigation = $(this.$target, ".tab-navigation");
    $tabNavigation.addEventListener("click", (event) => {
      const { tab } = event.target.dataset;
      if (tab) {
        this.handleTabClick(tab);
      }
    });
  }
  handleTabClick(tab) {
    if (this.state.activeTab === tab) {
      return;
    }
    this.setState({ activeTab: tab });
    this.props.onTabChange(tab);
    const $tabNavigation = $(this.$target, ".tab-navigation");
    const $allTab = $($tabNavigation, "#all-tab");
    const $favoriteTab = $($tabNavigation, "#favorite-tab");
    if (this.state.activeTab === "all") {
      $allTab.classList.add("active");
      $favoriteTab.classList.remove("active");
      return;
    }
    $allTab.classList.remove("active");
    $favoriteTab.classList.add("active");
  }
}
class Modal extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "closeModalByEscapeKey", (event) => {
      if (event.key === "Escape") {
        this.close();
      }
    });
  }
  setup() {
    this.state = {
      isOpen: false
    };
    this.closeModal = this.close.bind(this);
  }
  contents() {
    return "";
  }
  componentDidMount() {
    this.$backdrop = $(document, ".modal-backdrop");
    if (this.$backdrop) {
      this.$backdrop.removeEventListener("click", this.closeModal);
      this.$backdrop.addEventListener("click", this.closeModal);
      window.addEventListener("keydown", this.closeModalByEscapeKey);
    }
  }
  componentDidUpdate() {
    if (this.state.isOpen) {
      this.initialRender();
    }
  }
  componentWillUnmount() {
  }
  template() {
    if (!this.state.isOpen) return "";
    return (
      /* html */
      `
      <div class="modal" data-testid="modal">
        <div class="modal-backdrop" data-testid="modal-backdrop"></div>
        <div id="modal-container" class="modal-container">
          ${this.contents()}
        </div>
      </div>
    `
    );
  }
  open() {
    if (!this.state.isOpen) {
      this.setState({ isOpen: true });
    }
  }
  close() {
    window.removeEventListener("keydown", this.closeModalByEscapeKey);
    if (this.state.isOpen) {
      this.componentWillUnmount();
      this.setState({ isOpen: false });
      this.$target.replaceChildren();
    }
  }
}
const FormFieldContainer = ({ contents, required, label, name }) => {
  return (
    /* html */
    `
    <div class="form-item ${required ? "form-item--required" : ""}">
      <label for="${name}" class="text-caption">${label}</label>
      ${contents}
    </div>
  `
  );
};
const RESTAURANT_RULES = Object.freeze({
  MAX_RESTAURANT_NAME: 15,
  MIN_RESTAURANT_NAME: 1,
  DISTANCES: Object.freeze([5, 10, 15, 20, 30]),
  MAX_DESCRIPTION_TEXT_LENGTH: 300,
  CATEGORIES: Object.freeze(["한식", "중식", "일식", "양식", "아시안", "기타"])
});
const Category = () => {
  const label = "카테고리";
  const name = "category";
  const required = true;
  const contents = (
    /*html*/
    `
    <select name="category" id="category" required data-testid="category">
      <option value="">선택해 주세요</option>
      ${RESTAURANT_RULES.CATEGORIES.map(
      (option) => `<option value="${option}">${option}</option>`
    ).join("")}
    </select>
  `
  );
  return FormFieldContainer({ contents, required, label, name });
};
const RestaurantName = () => {
  const label = "이름";
  const name = "name";
  const required = true;
  const contents = (
    /*html*/
    `
    <input type="text" name="name" id="name" required minlength="${RESTAURANT_RULES.MIN_RESTAURANT_NAME}" maxlength="${RESTAURANT_RULES.MAX_RESTAURANT_NAME}" data-testid="restaurant-name"/>
  `
  );
  return FormFieldContainer({ contents, required, label, name });
};
const Distance = () => {
  const label = "거리(도보 이동 시간)";
  const name = "distance";
  const required = true;
  const contents = (
    /* html */
    `
    <select name="distance" id="distance" required data-testid="distance">
      <option value="">선택해 주세요</option>
      ${RESTAURANT_RULES.DISTANCES.map(
      (option) => `<option value="${option}">${option}분 내</option>`
    ).join("")};
    </select>
  `
  );
  return FormFieldContainer({ contents, required, label, name });
};
const Description = () => {
  const label = "설명";
  const name = "description";
  const required = false;
  const contents = (
    /*html*/
    `
    <textarea name="description" id="description" cols="30" rows="5" maxlength="${RESTAURANT_RULES.MAX_DESCRIPTION_TEXT_LENGTH}" data-testid="description"></textarea>
    <span class="help-text text-caption">메뉴 등 추가 정보를 입력해 주세요.</span>
  `
  );
  return FormFieldContainer({ contents, required, label, name });
};
const Link = () => {
  const label = "참고 링크";
  const name = "link";
  const required = false;
  const contents = (
    /* html */
    `
    <input type="text" name="link" id="link" data-testid="link">
    <span class="help-text text-caption">매장 정보를 확인할 수 있는 링크를 입력해 주세요.</span>
  `
  );
  return FormFieldContainer({ label, name, required, contents });
};
const toThrowNewError = ({ condition, message }) => {
  if (condition) {
    throw new Error(message);
  }
};
const validateCategory = (category) => {
  toThrowNewError({
    condition: !category.trim(),
    message: "카테고리를 선택해주세요."
  });
  toThrowNewError({
    condition: !RESTAURANT_RULES.CATEGORIES.includes(category),
    message: `카테고리는 ${RESTAURANT_RULES.CATEGORIES.join(
      ", "
    )} 중 하나여야 합니다.`
  });
};
const validateRestaurantName = (name) => {
  toThrowNewError({
    condition: name.trim().length < RESTAURANT_RULES.MIN_RESTAURANT_NAME || name.trim().length > RESTAURANT_RULES.MAX_RESTAURANT_NAME,
    message: `레스토랑 이름을 최소 ${RESTAURANT_RULES.MIN_RESTAURANT_NAME}글자 ~ 최대 ${RESTAURANT_RULES.MAX_RESTAURANT_NAME}글자 입력해주세요.`
  });
};
const validateDistance = (distance) => {
  toThrowNewError({
    condition: !distance,
    message: "거리(도보 이동 시간)를 선택해주세요."
  });
  toThrowNewError({
    condition: !RESTAURANT_RULES.DISTANCES.includes(
      Number.parseInt(distance, 10)
    ),
    message: `거리(도보 이동 시간)는 ${RESTAURANT_RULES.DISTANCES.map(
      (distance2) => `${Number.parseInt(distance2, 10)}분`
    ).join(", ")} 중 하나여야 합니다.`
  });
};
const validateDescription = (description) => {
  toThrowNewError({
    condition: description.length > RESTAURANT_RULES.MAX_DESCRIPTION_TEXT_LENGTH,
    message: `설명은 ${RESTAURANT_RULES.MIN_DESCRIPTION_TEXT_LENGTH}자 이상 ${RESTAURANT_RULES.MAX_DESCRIPTION_TEXT_LENGTH}자 이하여야 합니다.`
  });
};
const regularUrl = /^(https?:\/\/)?([\w\d.-]+)\.([a-z.]{2,6})(\/[\w\d.-]*)*\/?$/i;
const validateLink = (link) => {
  toThrowNewError({
    condition: link !== "" && !regularUrl.test(link),
    message: `잘못된 링크 형식입니다.`
  });
};
class AddRestaurantModal extends Modal {
  constructor() {
    super(...arguments);
    __publicField(this, "updateRestaurantList", (event) => {
      event.preventDefault();
      try {
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        this.validateData(data);
        this.props.updateRestaurant(data);
        this.close();
      } catch (error) {
        alert(error.message);
      }
    });
  }
  contents() {
    return (
      /*html */
      `
      <h2 class="modal-title text-title">새로운 음식점</h2>
      <form id='add-restaurant-form' data-testid='add-restaurant-form'>
        ${Category()}
        ${RestaurantName()}
        ${Distance()}
        ${Description()}
        ${Link()}

        <div class="button-container">
          <button type="button" id="cancel-add-restaurant-form" class="button button--secondary text-caption" data-testid="cancel-add-restaurant-form">취소하기</button>
          <button class="button button--primary text-caption">추가하기</button>
        </div>
      </form>
    `
    );
  }
  componentDidMount() {
    super.componentDidMount();
    if (this.state.isOpen) {
      this.addEventListeners();
    }
  }
  addEventListeners() {
    const $cancelButton = $(document, "#cancel-add-restaurant-form");
    const $addForm = $(document, "#add-restaurant-form");
    $cancelButton.removeEventListener("click", this.closeModal);
    $addForm.removeEventListener("submit", this.updateRestaurantList);
    $cancelButton.addEventListener("click", this.closeModal);
    $addForm.addEventListener("submit", this.updateRestaurantList);
  }
  validateData(data) {
    const { category, name, distance, description, link } = data;
    validateCategory(category);
    validateRestaurantName(name);
    validateDistance(distance);
    validateDescription(description);
    validateLink(link);
  }
}
const filledStar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAImSURBVHgB7ZZPchJBFMa/14wJIQsnpSTlDk5gcgKHhVXIRj2BeAKHE8ScIDlCvAFsCLtwA71BcGUVWJVZKKESpp/9qkRJmGF6mmSRKn5VFD399+vX771uYM1jZtjYbv5slN5iBTysgGL94W+xA0cIjpjd7yvwVymz1rVyb9KHAwquMIf/ylR4B0ecLHBZL1ZipS7mqqLCeKO6048i5MTJAjeqENyp8qel6xAOOAkg6MPFOnyCA7kFSOgRqJLQ5I/qxQA5WeoDP8xZy7+J1QrJj+ipJoQpAoRvxHzKoO/MOuI4juJCIXrRmwyQJeAy8P24dH1sJghYkQ+Gj/uEEJk5ByLSOGxr5rC3LCA79ojOzU4reADYCJiyrs1b5JYPSMOUuSYqcd8w939dbRzcPY5UHxg1tk8I7OTZi4vjy/OzcTOpKTUKyt3fIQNHWHltHKUtLmRmwuGbrVARHcMBzdzaPbs6WdbHKhVLfJNS58gD473ZeTurm/tllLW+yQM2/ewEKBUgL5ZjrASY5PQKObEdY2kB2kdeyG5MpgB5+SSlZclqsXE0rfVHZh4kDPWHr59kisi2AOtgocrEtmS1PePlu73Jqbe5eZCYMzwvwKoCTA74f5Ymnd5oXS13x5+rc6+fnXYUSZ20mc/23NiXWfNn5oFRY+sCbJ4gQGvPIq6FYb3YNBfaoRGAZ91xdVnfpRaQtx9YdWbmhiVyLHKpaVBn9qZYsyaNP7Nh02Yfw0qUAAAAAElFTkSuQmCC";
const emptyStar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMvSURBVHgB7VYxb9pAFH53thMDqeSoTeSRbIwZGT21FHXImLFjf1LGjBkZqgZ18sjIyFa2oqQSVgW2Mfa9vmcMdRLZRo5UqRKfhO7Mvbv77r3vvTuAA/5nPPRbl7/eH3XgFdDhdbhUukFNNIGakFATdHpbALb597NntqEmahNAxO5uESEvoSZqEZhfgSUF7DbVhOj8cMCEGqhFYB212tySFzyVwAwBzRPzpAs1UC8EqJy0FdJFieNNF/8NAU49IYQlQIRLfzkJgmDMffZCHTGKssG5Y1lpxwwtkIm1Qt0kxt2UAML43b0/SEl9OO4JTWMPzBLE8bGIQ1Cat5ZaaPhGeOp6XtEeuzrAImo2mj1OKynQRJBmDFE2KtOflqOrBUcugJ996BSGNAQ2CbIXg5FOobUgbkbw2G9SX5GXpKcQZn7gDy9cCF94YH5lWevV6jOf8K+LVKiQXKxUSOnmKSFCGp+ef1uO83NnHxtdCoUtUG3mspdy6zBYtEZwfJv3yIsQMIkoiq7pAPbm8NI9+7pwoQYeP5kOKOlsOS7889sLdxrmbQo1kItrLRIkVg5nOj+vl+coFeFjj04gpbOxlJPFcjHYxq4IrKU3pCXcFipF5IfF5EsJMDi2LCzucwyXQXBTRIIrZBw1ryELn0Qcvr0PRmXrV9YBmxaIlbpN2ZKoWs2WVWydDqWbizi+q9p8LwKMbZHngkPqnxXZnQ48j224v5YyhD2wF4EYoM0tUvrl/3/ogz134GmqKZXa6KC3YQ/s9SBBqfG9D1IlU/5moVEoHFZ53GQiYmT4y9GpC14iYKoBdOiOaO+z9l4EuCYgtRHijO8CCUmPa/92nImsG43OQ1+6iUpmJBbY1ZEKVGZB9vL5wn0EMeVSnfYpI2SiD5WuTL4dt1XviQ2ImzLNMCo9oFC1KQ0ztplblXKXoT3aVjUKyeTENLtcM3Y2BI3mUvM6AhqSADM/scCM0Bxsavl0Z7OpC6FLZXwch6sevdHSlzJ5oDIMlQSootmQufvsu0+v3+Ls4jSk5o51wmHBLHvKUP4eoMqmglb39+rMfX6JVCG9WYOga6wao7L3wAEH/AHvIXBYnJG13wAAAABJRU5ErkJggg==";
const CATEGORY_IMAGES$1 = Object.freeze({
  한식: "category-korean.png",
  중식: "category-chinese.png",
  일식: "category-japanese.png",
  양식: "category-western.png",
  아시안: "category-asian.png",
  기타: "category-etc.png"
});
const imageSource$1 = (category) => {
  return CATEGORY_IMAGES$1[category];
};
class RestaurantInfoModal extends Modal {
  constructor() {
    super(...arguments);
    __publicField(this, "updateFavoriteIconInList", () => {
      const { id, isFavorite } = this.props.data;
      const $restaurantItem = $(document, `#${id}`);
      if (!$restaurantItem) return;
      const $img = $($restaurantItem, ".favorite-icon");
      if ($img) {
        $img.setAttribute("src", isFavorite ? filledStar : emptyStar);
      }
    });
    __publicField(this, "deleteCurrentRestaurant", () => {
      this.props.deleteRestaurant(this.props.data);
      this.close();
    });
    __publicField(this, "toggleFavoriteRestaurant", () => {
      this.props.changeLocalStorageState(this.props.data);
      this.props.data = {
        ...this.props.data,
        isFavorite: !this.props.data.isFavorite
      };
    });
  }
  contents() {
    const { category, name, distance, description, link, isFavorite, id } = this.props.data;
    return (
      /*html */
      `
    <div id='restaurant-info-container' class="restaurant__info-container" data-testid="restaurant-info-modal"> 
      <button data-buttonId="${id}" type='button' class="favorite-icon-button" data-testid="favorite-detail-button">
        <img src=${isFavorite ? filledStar : emptyStar} class="favorite-icon" data-testid="favorite-icon"/>
      </button> 
      <div class="restaurant__detail__category">
        <img src="./icons/${imageSource$1(
        category
      )}" alt="${category}" class="category-icon">
      </div>
      <div class="restaurant__detail__info">
        <h2 class="restaurant__detail__name text-subtitle">${name}</h2>
        <span class="restaurant__detail__distance text-body">캠퍼스부터 ${distance}분 내</span>
        <p class="text-body">${description}</p>
        ${link && `<a href=${link} class="restaurant__detail__link">${link}</a>`}
      </div>
      <div class="button-container">
        <button id="delete-restaurant-info" class="button button--secondary text-caption">삭제하기</button>
        <button type="button" id="cancel-restaurant-info" class="button button--primary text-caption" data-testid="cancel-restaurant-info">닫기</button>
      </div>
    </div>
    `
    );
  }
  componentDidMount() {
    super.componentDidMount();
    if (this.state.isOpen) {
      this.addEventListeners();
    }
  }
  componentWillUnmount() {
    this.updateFavoriteIconInList();
  }
  addEventListeners() {
    const $cancelButton = $(document, "#cancel-restaurant-info");
    $cancelButton.removeEventListener("click", this.closeModal);
    $cancelButton.addEventListener("click", this.closeModal);
    const $deleteButton = $(
      $(document, "#restaurant-info-container"),
      "#delete-restaurant-info"
    );
    $deleteButton.addEventListener("click", this.deleteCurrentRestaurant);
    const $favoriteButton = $(this.$target, ".favorite-icon-button");
    $favoriteButton.addEventListener("click", this.toggleFavoriteRestaurant);
  }
}
const CATEGORY_IMAGES = Object.freeze({
  한식: "category-korean.png",
  중식: "category-chinese.png",
  일식: "category-japanese.png",
  양식: "category-western.png",
  아시안: "category-asian.png",
  기타: "category-etc.png"
});
const imageSource = (category) => {
  return CATEGORY_IMAGES[category];
};
const RestaurantItem = ({
  category,
  name,
  distance,
  description,
  id,
  isFavorite
}) => {
  return (
    /* html */
    `
    <li id="${id}" class="restaurant">
      <button data-buttonId="${id}" type='button' class="favorite-icon-button">
        <img src=${isFavorite ? filledStar : emptyStar} class="favorite-icon" data-testid="favorite-icon"/>
      </button> 
      <div class="restaurant__category">
        <img src="./icons/${imageSource(
      category
    )}" alt="${category}" class="category-icon">
      </div>
      <div class="restaurant__info">
        <h3 class="restaurant__name text-subtitle">${name}</h3>
        <span class="restaurant__distance text-body">캠퍼스부터 ${distance}분 내</span>
        <p class="restaurant__description text-body">${description}</p>
      </div>
    </li>
  `
  );
};
const RestaurantList = (restaurants2) => {
  return (
    /* html */
    `
    <section class="restaurant-list-container" >
      <ul id="restaurant-list" class="restaurant-list" data-testid="restaurant-list">
        ${restaurants2.map((restaurant) => RestaurantItem(restaurant)).join("")}
      </ul>
    </section>
  `
  );
};
const CategoryFilter = () => {
  const categoryFilters = ["전체", ...RESTAURANT_RULES.CATEGORIES];
  return (
    /*html*/
    `
    <select name="category" id="category-filter" class="restaurant-filter" data-testid="category-filter">
    ${categoryFilters.map(
      (categoryFilter) => `<option value="${categoryFilter}">${categoryFilter}</option>`
    ).join("")}
    </select>
  `
  );
};
const sortingOptions = {
  name: "이름",
  distance: "거리"
};
const SortingFilter = () => {
  const options = Object.entries(sortingOptions);
  return (
    /*html*/
    `
    <select name="sorting" id="sorting-filter" class="restaurant-filter" data-testid="sorting-filter">
      ${options.map(
      ([option, text]) => ` <option value="${option}">${text}순</option>`
    ).join("")}

    </select>
  `
  );
};
const localStorage = window.localStorage;
const setItemToLocalStorage = (key, value) => {
  const data = JSON.stringify(value);
  localStorage.setItem(key, data);
};
const getItemFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  if (data === null) {
    return null;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};
const restaurants = [
  {
    category: "한식",
    name: "피양콩할마니",
    distance: 10,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    link: ""
  },
  {
    category: "중식",
    name: "친친",
    distance: 5,
    description: "Since 2004 편리한 교통과 주차, 그리고 관록만큼 깊은 맛과 정성으로 정통 중식의 세계를 펼쳐갑니다",
    link: ""
  },
  {
    category: "일식",
    name: "잇쇼우",
    distance: 10,
    description: "잇쇼우는 정통 자가제면 사누끼 우동이 대표메뉴입니다. 기술은 정성을 이길 수 없다는 신념으로 모든 음식에 최선을 다하는 잇쇼우는 고객 한분 한분께 최선을 다하겠습니다",
    link: ""
  },
  {
    category: "양식",
    name: "이태리키친",
    distance: 20,
    description: "늘 변화를 추구하는 이태리키친입니다.",
    link: ""
  },
  {
    category: "아시안",
    name: "호아빈 삼성점",
    distance: 15,
    description: "푸짐한 양에 국물이 일품인 쌀국수",
    link: ""
  },
  {
    category: "기타",
    name: "도스타코스 선릉점",
    distance: 5,
    description: "멕시칸 캐주얼 그릴",
    link: ""
  }
];
const makeUniqueId = (data) => {
  return `id-${crypto.randomUUID(data)}`;
};
const filterByCategory = (restaurantList, category) => {
  if (category === "전체") {
    return restaurantList;
  }
  return restaurantList.filter(
    (restaurant) => restaurant.category === category
  );
};
const sortByOptions = {
  name: (array) => [...array].sort((a, b) => a.name.localeCompare(b.name)),
  distance: (array) => [...array].sort((a, b) => a.distance - b.distance)
};
const sorting = (restaurantList, sortCallback) => {
  return sortCallback(restaurantList);
};
const filterByFavorite = (restaurants2) => {
  return restaurants2.filter(({ isFavorite }) => isFavorite);
};
const lunchRestaurantsService = {
  LUNCH_KEY: "lunchRestaurantList",
  initializeRestaurantList(restaurants2) {
    return restaurants2.map((restaurant) => ({
      ...restaurant,
      id: makeUniqueId(restaurant.name),
      isFavorite: false
    }));
  },
  getRestaurants() {
    return getItemFromLocalStorage(this.LUNCH_KEY) ?? this.initializeRestaurantList(restaurants);
  },
  saveRestaurants(restaurants2) {
    setItemToLocalStorage(this.LUNCH_KEY, restaurants2);
  },
  addRestaurant(restaurants2, newRestaurant) {
    const newRestaurantWithId = {
      ...newRestaurant,
      id: makeUniqueId(newRestaurant.name),
      isFavorite: false
    };
    const newRestaurantList = [newRestaurantWithId, ...restaurants2];
    this.saveRestaurants(newRestaurantList);
    return { newRestaurantList, newRestaurantWithId };
  },
  deleteRestaurant(restaurants2, restaurantToDelete) {
    const newRestaurantList = restaurants2.filter(
      ({ id }) => id !== restaurantToDelete.id
    );
    this.saveRestaurants(newRestaurantList);
    return newRestaurantList;
  },
  toggleFavoriteRestaurant(restaurants2, restaurantId) {
    const updatedRestaurants = restaurants2.map(
      (restaurant) => restaurant.id === restaurantId ? { ...restaurant, isFavorite: !restaurant.isFavorite } : restaurant
    );
    this.saveRestaurants(updatedRestaurants);
    return updatedRestaurants;
  },
  filterAndSortRestaurants(restaurants2, sortingOption = "name", categoryFilter = "전체") {
    const sortByOption = sortByOptions[sortingOption];
    return sorting(filterByCategory(restaurants2, categoryFilter), sortByOption);
  }
};
class App extends Component {
  setup() {
    this.state = {
      restaurants: this.props.lunchDomain.getRestaurants(),
      activeTab: "all"
    };
    this.props.lunchDomain.saveRestaurants(this.state.restaurants);
  }
  updateRestaurant(newRestaurant) {
    const { newRestaurantList, newRestaurantWithId } = this.props.lunchDomain.addRestaurant(
      this.state.restaurants,
      newRestaurant
    );
    this.setState({ restaurants: newRestaurantList });
    this.addNewRestaurantToUI(newRestaurantWithId);
  }
  addNewRestaurantToUI(newRestaurant) {
    const $categoryFilter = $(document, "#category-filter");
    if ($categoryFilter.value !== "전체" && $categoryFilter.value !== newRestaurant.category) {
      return;
    }
    const $restaurantList = $(document, ".restaurant-list");
    $restaurantList.insertAdjacentHTML(
      "afterbegin",
      RestaurantItem(newRestaurant)
    );
  }
  deleteRestaurant(targetRestaurant) {
    const updatedList = this.props.lunchDomain.deleteRestaurant(
      this.state.restaurants,
      targetRestaurant
    );
    this.setState({ restaurants: updatedList });
    this.renderDeleteRestaurant(targetRestaurant);
  }
  renderDeleteRestaurant(targetRestaurant) {
    const { id } = targetRestaurant;
    const $targetRestaurant = $(document, `#${id}`);
    $targetRestaurant.remove();
  }
  handleTabChange(tab) {
    this.setState({ activeTab: tab });
    this.renderTabByFilter();
  }
  template() {
    return (
      /*html*/
      `
        <main>
          <section class="restaurant-filter-container"></section>
          <div class="restaurant-list-container"></div>
        </main>
        <div id="modal"></div>
    `
    );
  }
  renderCategoryFilter($restaurantFilterContainer) {
    $restaurantFilterContainer.insertAdjacentHTML(
      "beforeend",
      CategoryFilter()
    );
    const $categoryFilter = $($restaurantFilterContainer, "#category-filter");
    $categoryFilter.addEventListener("change", (event) => {
      const restaurantSection = $(document, ".restaurant-list-container");
      restaurantSection.remove();
      const category = event.target.value;
      const $sortingFilter = $($restaurantFilterContainer, "#sorting-filter");
      const sorting2 = $sortingFilter.value;
      this.renderRestaurantList(
        this.props.lunchDomain.filterAndSortRestaurants(
          this.state.restaurants,
          sorting2,
          category
        )
      );
    });
  }
  renderSortingFilter($restaurantFilterContainer) {
    $restaurantFilterContainer.insertAdjacentHTML("beforeend", SortingFilter());
    const $sortingFilter = $($restaurantFilterContainer, "#sorting-filter");
    $sortingFilter.addEventListener("change", (event) => {
      const restaurantSection = $(document, ".restaurant-list-container");
      restaurantSection.remove();
      const $categoryFilter = $($restaurantFilterContainer, "#category-filter");
      const category = $categoryFilter.value;
      const sorting2 = event.target.value;
      this.renderRestaurantList(
        this.props.lunchDomain.filterAndSortRestaurants(
          this.state.restaurants,
          sorting2,
          category
        )
      );
    });
  }
  renderRestaurantList(restaurants2) {
    const $main = $(document, "main");
    $main.insertAdjacentHTML("beforeend", RestaurantList(restaurants2));
    $(document, "#restaurant-list").addEventListener("click", (event) => {
      const restaurantItem = event.target.closest("li");
      const restaurant = this.state.restaurants.find(
        ({ id }) => id === restaurantItem.id
      );
      const $button = event.target.closest("button");
      if ($button && $button.dataset.buttonid === restaurant.id) {
        this.toggleFavoriteRestaurantAndUpdateState(restaurant, $button);
        return;
      }
      this.openRestaurantInfoModal(restaurant);
    });
  }
  openRestaurantInfoModal(restaurant) {
    const changeLocalStorageState = (restaurant2) => {
      const updatedList = this.props.lunchDomain.toggleFavoriteRestaurant(
        this.state.restaurants,
        restaurant2.id
      );
      this.setState({ restaurants: updatedList });
      updatedList.find(
        ({ id }) => id === restaurant2.id
      );
      this.toggleFavoriteToUI(
        updatedList,
        restaurant2,
        $(document, "#restaurant-info-container")
      );
    };
    const restaurantInfoModal = new RestaurantInfoModal($(document, "#modal"), {
      data: restaurant,
      deleteRestaurant: this.deleteRestaurant.bind(this),
      changeLocalStorageState
    });
    restaurantInfoModal.open();
  }
  toggleFavoriteRestaurantAndUpdateState(restaurant, $button) {
    const updatedList = this.props.lunchDomain.toggleFavoriteRestaurant(
      this.state.restaurants,
      restaurant.id
    );
    this.setState({ restaurants: updatedList });
    this.toggleFavoriteToUI(updatedList, restaurant, $button);
  }
  toggleFavoriteToUI(updatedList, restaurant, $target) {
    const updatedRestaurant = updatedList.find(
      ({ id }) => id === restaurant.id
    );
    const $img = $($target, ".favorite-icon");
    if ($img) {
      $img.setAttribute(
        "src",
        updatedRestaurant.isFavorite ? filledStar : emptyStar
      );
    }
  }
  renderTabByFilter() {
    const restaurantSection = $(document, ".restaurant-list-container");
    restaurantSection.remove();
    const $restaurantFilterContainer = $(
      document,
      ".restaurant-filter-container"
    );
    $restaurantFilterContainer.replaceChildren();
    if (this.state.activeTab === "all") {
      this.renderAllTab($restaurantFilterContainer);
      return;
    }
    this.renderFavoriteTab();
  }
  renderAllTab($restaurantFilterContainer) {
    this.renderCategoryFilter($restaurantFilterContainer);
    this.renderSortingFilter($restaurantFilterContainer);
    this.renderRestaurantList(
      this.props.lunchDomain.filterAndSortRestaurants(this.state.restaurants)
    );
  }
  renderFavoriteTab() {
    const restaurantsToRender = filterByFavorite(this.state.restaurants);
    this.renderRestaurantList(
      this.props.lunchDomain.filterAndSortRestaurants(restaurantsToRender)
    );
  }
  componentDidMount() {
    const $modal = new AddRestaurantModal($(document, "#modal"), {
      updateRestaurant: this.updateRestaurant.bind(this)
    });
    const openModal = () => {
      if (!$modal) {
        return;
      }
      $modal.open();
    };
    new Header($(document, "#app"), {
      data: {
        title: "점심 뭐 먹지",
        ariaLabel: "음식점 추가",
        dataTestId: "open-add-restaurant-modal-button",
        iconImageSource: "./icons/add-button.png",
        alt: "음식점 추가"
      },
      buttonCallback: openModal
    });
    new TabNavigation($(document, "main"), {
      onTabChange: this.handleTabChange.bind(this)
    });
    this.renderTabByFilter();
  }
}
const app = $(document, "#app");
new App(app, { lunchDomain: lunchRestaurantsService });
