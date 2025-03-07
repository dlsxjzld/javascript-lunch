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
const Header = () => {
  return (
    /*html*/
    `
    <header class="gnb">
      <h1 class="gnb__title text-title">점심 뭐 먹지</h1>
      <button type="button" class="gnb__button" aria-label="음식점 추가" data-testid="open-add-restaurant-modal-button">
        <img src="./icons/add-button.png" alt="음식점 추가">
      </button>
    </header>
  `
  );
};
const RestaurantItem = ({ category, name, distance, description }) => {
  const imageSource = () => {
    switch (category) {
      case "한식":
        return "category-korean.png";
      case "중식":
        return "category-chinese.png";
      case "일식":
        return "category-japanese.png";
      case "양식":
        return "category-western.png";
      case "아시안":
        return "category-asian.png";
      default:
        return "category-etc.png";
    }
  };
  return (
    /* html */
    `
    <li class="restaurant">
      <div class="restaurant__category">
        <img src="./icons/${imageSource()}" alt="${category}" class="category-icon">
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
    <section class="restaurant-list-container" data-testid="restaurant-list">
      <ul class="restaurant-list">
        ${restaurants2.map((restaurant) => RestaurantItem(restaurant)).reverse().join("")}
      </ul>
    </section>
  `
  );
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
class Modal extends Component {
  setup() {
    this.state = {
      isOpen: false
    };
    this.handleClose = this.close.bind(this);
  }
  contents() {
    return "";
  }
  componentDidMount() {
    this.$backdrop = this.$target.querySelector(".modal-backdrop");
    if (this.$backdrop) {
      this.$backdrop.removeEventListener("click", this.handleClose);
      this.$backdrop.addEventListener("click", this.handleClose);
    }
  }
  componentDidUpdate() {
    if (this.state.isOpen) {
      this.initialRender();
    }
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
    if (this.state.isOpen) {
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
const RULES = Object.freeze({
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
      ${RULES.CATEGORIES.map(
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
    <input type="text" name="name" id="name" required minlength="${RULES.MIN_RESTAURANT_NAME}" maxlength="${RULES.MAX_RESTAURANT_NAME}" data-testid="restaurant-name"/>
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
      ${RULES.DISTANCES.map(
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
    <textarea name="description" id="description" cols="30" rows="5" maxlength="${RULES.MAX_DESCRIPTION_TEXT_LENGTH}" data-testid="description"></textarea>
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
    condition: !RULES.CATEGORIES.includes(category),
    message: "카테고리는 한식, 중식, 일식, 양식, 아시안, 기타 중 하나여야 합니다."
  });
};
const validateRestaurantName = (name) => {
  toThrowNewError({
    condition: name.trim().length < RULES.MIN_RESTAURANT_NAME || name.trim().length > RULES.MAX_RESTAURANT_NAME,
    message: `레스토랑 이름을 최소 ${RULES.MIN_RESTAURANT_NAME}글자 ~ 최대 ${RULES.MAX_RESTAURANT_NAME}글자 입력해주세요.`
  });
};
const validateDistance = (distance) => {
  toThrowNewError({
    condition: !distance,
    message: "거리(도보 이동 시간)를 선택해주세요."
  });
  toThrowNewError({
    condition: !RULES.DISTANCES.includes(parseInt(distance, 10)),
    message: "거리(도보 이동 시간)는 5분, 10분, 15분, 20분, 30분 중 하나여야 합니다."
  });
};
const validateDescription = (description) => {
  toThrowNewError({
    condition: description.length > RULES.MAX_DESCRIPTION_TEXT_LENGTH,
    message: `설명은 ${RULES.MIN_DESCRIPTION_TEXT_LENGTH}자 이상 ${RULES.MAX_DESCRIPTION_TEXT_LENGTH}자 이하여야 합니다.`
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
    __publicField(this, "handleSubmit", (event) => {
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
    const $cancelButton = document.querySelector("#cancel-add-restaurant-form");
    const $addForm = document.querySelector("#add-restaurant-form");
    $cancelButton.removeEventListener("click", this.handleClose);
    $addForm.removeEventListener("submit", this.handleSubmit);
    $cancelButton.addEventListener("click", this.handleClose);
    $addForm.addEventListener("submit", this.handleSubmit);
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
class App extends Component {
  setup() {
    this.state = {
      restaurants
    };
  }
  updateRestaurant(newRestaurant) {
    this.setState({
      restaurants: [...this.state.restaurants, newRestaurant]
    });
  }
  template() {
    return (
      /*html*/
      `
        ${Header()}
        <main></main>
        <div id="modal"></div>
    `
    );
  }
  componentDidUpdate() {
    this.renderRestaurantList();
  }
  componentDidMount() {
    const $modal = new AddRestaurantModal(document.querySelector("#modal"), {
      updateRestaurant: this.updateRestaurant.bind(this)
    });
    const $gnbButton = this.$target.querySelector(".gnb__button");
    $gnbButton.addEventListener("click", () => {
      $modal.open();
    });
    this.renderRestaurantList();
  }
  renderRestaurantList() {
    const $main = document.querySelector("main");
    $main.replaceChildren();
    $main.insertAdjacentHTML(
      "afterbegin",
      RestaurantList(this.state.restaurants)
    );
  }
}
const app = document.querySelector("#app");
new App(app);
