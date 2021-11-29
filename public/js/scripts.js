var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: {
        results: false, 
        showTab: 'all',
        showErrors: true,
        showWarnings: true,
        showNotices: true,
        lengthErrors: 0,
        lengthWarnings: 0,
        lengthNotices: 0,
        lengthAll: 0
    },
    mounted: function () {
        this.showTab = 'errors';
        this.showWarnings = false;
        this.showNotices = false;
        this.lengthErrors = this.countErrors();
        this.lengthWarnings = this.countWarnings();
        this.lengthNotices = this.countNotices();
        this.lengthAll  = this.lengthErrors + this.lengthWarnings + this.lengthNotices;
    },
    methods: {
        tabToggle: function (tabSelected) {
            this.showTab = tabSelected;
            switch(tabSelected){
                case "notices":
                    this.showErrors = false;
                    this.showWarnings = false;
                    this.showNotices = true;
                    break;
                case "warnings":
                    this.showErrors = false;
                    this.showWarnings = true;
                    this.showNotices = false;
                    break;
                case "errors":
                    this.showErrors = true;
                    this.showWarnings = false;
                    this.showNotices = false;
                    break;
                case "all":
                    this.showErrors = true;
                    this.showWarnings = true;
                    this.showNotices = true;
                    break;
            }
        },
        showCard: function (type) {
            switch(type){
                case "notice":
                    if(this.showNotices)
                        return true;
                    break;
                case "warning":
                    if(this.showWarnings)
                        return true;
                    break;
                case "error":
                    if(this.showErrors)
                        return true;
                    break;
            }
            return false;
        },
        countNotices: function () {
            let elements = document.getElementsByClassName('cards-type-notice');
            if (elements)
                return elements.length;
            return 0;
        },
        countWarnings: function () {
            let elements = document.getElementsByClassName('cards-type-warning');
            if (elements)
                return elements.length;
            return 0;
        },
        countErrors: function () {
            let elements = document.getElementsByClassName('cards-type-error');
            if (elements)
                return elements.length;
            return 0;
        }
    }
});