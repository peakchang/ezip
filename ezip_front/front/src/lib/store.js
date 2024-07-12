import { writable } from 'svelte/store'
import _cloneDeep from 'lodash/cloneDeep'

export let user_info = writable('');
export let _myTabPosition = writable("");

export let imgArr = writable([]);


export let admin_sidebar = writable(false);
export let admin_sidebar_width = writable(false);

