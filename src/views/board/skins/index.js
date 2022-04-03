import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';

const requireModule = require.context('.', true, /(Form|List|Read)\.vue$/, 'lazy');
const modules = {};

requireModule.keys().forEach(filename => {
    const moduleName = upperFirst(camelCase(filename.replace(/(\.\/|\.vue)/g, '')));
    modules[moduleName] = () => requireModule(filename);

});

// Object
// BasicForm: ƒ ()
// BasicList: ƒ ()
// BasicRead: ƒ ()
// GalleryForm: ƒ ()
// GalleryList: ƒ ()
// GalleryRead: ƒ ()

export default modules;