import {
    artData
} from "./api.js";

var app = new Vue({
    el: '#app',
    data: {
        artData: [],
        filterItem: [],
        search: '',
    },

    //搜尋監聽
    watch: {
        search: function () {
            this.searchItem();
        }
    },

    methods: {
        searchItem() {
            const vm = this;
            let key = Object.keys(vm.artData)
            let a = key.filter(e=>{
                if(vm.artData[e]['name']["name-TWzh"].match(vm.search)){
                    return vm.artData[e]['id']
                }; 
            })
            vm.filterItem = a.map(item => vm.artData[item]);
            console.log(vm.filterItem);
        },

        getArtData() {
            artData()
                .then(res => {
                    console.log(res.data);
                    let vm = this;
                    vm.artData = res.data;
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },

    created() {
        this.getArtData();
    },

});