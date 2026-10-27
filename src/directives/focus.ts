import type { ObjectDirective } from 'vue'

const vFocus: ObjectDirective<HTMLInputElement> = {
  mounted(el) {
    el.focus()
  },
}

export default vFocus
