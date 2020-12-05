import Vue from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faList, faSearch, faBell, faComments, faCog, faInfoCircle, faNotesMedical, faPlus, faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faList,
  faSearch,
  faBell,
  faComments,
  faCog,
  faInfoCircle,
  faNotesMedical,
  faPlus,
  faRedo
);

Vue.component("fa-icon", FontAwesomeIcon);