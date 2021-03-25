import {
    artData
} from "./api.js";

Vue.config.devtools = true;

var app = new Vue({
    el: '#app',
    data: {
        artData: [],
        filterItem: [],
        artDonated: [],
        search: '',
    },

    //搜尋監聽
    watch: {
        search: function () {
            this.searchItem();
        },
        artDonated: function(){
            let donatedStr =JSON.stringify(this.artDonated);
            localStorage.setItem('donatedList',donatedStr);
        }
    },

    methods: {
        searchItem() {
            const vm = this;
            //搜尋功能  美術品名字比對輸入文字 回傳符合項目
            vm.filterItem = vm.artData.filter(item => {
                if (item['name']["name-TWzh"].match(vm.search)) {
                    return item
                };
            });
        },

        //紀錄捐贈與否
        donate(id) {
            let vm = this;
            let newIndex =vm.artData.findIndex((item)=>{
                return item.id == id
            })
            vm.artData[newIndex].donated = !vm.artData[newIndex].donated;
            vm.artDonated=[];
            vm.artData.forEach(
                (item,newIndex) =>{ 
                if(item.donated){
                    vm.artDonated.push(newIndex)
                }
            })
        },

        getDonated(){
            let vm = this;
            vm.artDonated =JSON.parse(localStorage.getItem('donatedList'));
            //更新已捐贈物品
            vm.artDonated.forEach(
                item => vm.artData[item].donated = true
            );
        },

        getArtData() {
            artData()
                .then(res => {
                    console.log(res.data);
                    let vm = this;

                    //從物件取出陣列
                    let key = Object.keys(res.data);
                    vm.artData = key.map(
                        item => res.data[item]
                    );

                    //新增 捐贈確認項目
                    //得用強制寫入使 donated 有響應功能
                    vm.artData.forEach(
                        item => this.$set(item, 'donated', false)
                    );

                    this.getDonated()
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },

    created() {
        this.getArtData();
    },
    beforeDestroy: function () {
        localStorage.setItem('myName2',`it's work beforeDestroy`)
    }

});