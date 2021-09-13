const fs = require('fs');
const path = require('path');
const antd = require('ant-design-vue');


const antdNameList = Object.keys(antd).filter(k => /^[A-Z]/.test(k))

const comment = `// !请不要手动修改该文件及该目录下的内容，该目录内容皆通过 'npm run genComponents' 命令创建.`;

const componentsName = antdNameList.filter(k => /^[A-Z]{1}/.test(k));

const toCamelCase = str => str.replace(/^([A-Z])/, match => match.toLowerCase());
const toKebabCase = str => str.replace(/[A-Z]/g, (match, i) => (i ? '-' : '') + match.toLowerCase());


const getComponentContent = componentName => {
    componentName = toKebabCase(componentName);

    return `${comment}
import 'ant-design-vue/es/${componentName}/style/css';\n\nexport { default } from 'ant-design-vue/es/${componentName}';\n`;
}

const generateComponentFiles = componentName => {
    const componentContent = getComponentContent(componentName);
    const componentFilePath = path.resolve(__dirname, '../src', 'components', `${componentName}.tsx`);

    fs.writeFile(componentFilePath, componentContent, (err) => {
        if (err) throw err;
        console.log(`The component ${componentName} has been generated!`);
    });
}

const importerList = [];

const writeComponentsImporter = (componentName) => {
    const importer = `${toCamelCase(componentName)}: () => import('./${componentName}'),`;
    importerList.push(importer);
}

const generateComponentsImporter = componentsName => {

    const generateComponentContent = `${comment}
type ComponentsImporter = {
    [x: string]: Function
}

const componentsImporter: ComponentsImporter = {
    ${componentsName.join('\n\t').trimEnd()}
}

export default componentsImporter;\n`;

    const componentFilePath = path.resolve(__dirname, '../src', 'components', 'index.ts');

    fs.writeFile(componentFilePath, generateComponentContent, (err) => {
        if (err) throw err;
        console.log(`The componentsImporter has been generated!`);
    });
};


componentsName.forEach((name, i) => {
    generateComponentFiles(name);
    writeComponentsImporter(name);
});

generateComponentsImporter(importerList);
