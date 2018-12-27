var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: {
        showTab: 'all',
        showErrors: true,
        showWarnings: true,
        showNotices: true
    },
    mounted: function () {
        this.showTab = 'errors';
        this.showWarnings = false;
        this.showNotices = false;
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
        showCard: function (type){
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
        }
    }
});