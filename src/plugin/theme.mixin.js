const DARK = 'dark';
const LIGHT = 'light';
const HIGH_CONTRAST = 'high-contrast'

export default {
    props: {
        // Register a variant function for changing the theme
        variant: {
            type: String,
            default: 'dark',
            validator: function (value) {
                return [DARK, LIGHT, HIGH_CONTRAST].indexOf(value) !== -1;
            }
        },  
    },
    computed: {
        _classes() {
            let classString = ''
            switch (this.variant) {
                case DARK:
                    classString = DARK;
                    break;
                case LIGHT:
                    classString = LIGHT;
                    break;
                case HIGH_CONTRAST:
                    classString = HIGH_CONTRAST;
                    break;
                default:
                    classString = DARK;
                    break;
            }

            return classString;
        }
    }

}