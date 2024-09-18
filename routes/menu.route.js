const Router = require('express').Router();
const menuController = require('../controllers/menu.controller');
Router.route('/')
  .get(menuController.getAllMenus)
  .post(menuController.createMenu);

Router.route('/:id')
  .get(menuController.getMenu)
  .patch(menuController.updateMenu)
  .delete(menuController.deleteMenu);
