export default defineAppConfig({
    ui: {
        primary: 'blue',
        gray   : 'neutral',

        input: {
            color: {
                red: {
                    outline: 'bg-red-100 ring-red-400 ring-2'
                }
            }
        },

        notifications: {
            position: 'end-0'
        },

        notification: {
            ring: ''
        }
    }
})