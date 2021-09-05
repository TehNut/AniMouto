import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEllipsisV, faList, faSearch, faBell, faComments, faCog, faInfoCircle, faNotesMedical, faPlus, faRedo, faExclamationCircle, faTrash, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faEllipsisV,
  faList,
  faSearch,
  faBell,
  faComments,
  faCog,
  faInfoCircle,
  faNotesMedical,
  faPlus,
  faRedo,
  faExclamationCircle,
  faTrash,
  faHeart
);

Vue.component("fa-icon", FontAwesomeIcon);