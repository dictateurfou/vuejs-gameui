import { defineAsyncComponent } from 'vue'

const modules = import.meta.glob('../App/**/*.vue')
const components = {}

for (const path in modules) {
	const relativePath = path.replace('../App/', '')
	const componentName = relativePath.replace(/\.\w+$/, '')
	components[componentName] = defineAsyncComponent(() => modules[path]())
}
export default components