import {
    seaData
} from "./api.js";

Vue.config.devtools = true;

var app = new Vue({
    el: '#app',
    data: {
        seaData: [],
        filterItem: [],
        seaDonated: [],
        search: '',
        month:'',
    },

    //搜尋監聽
    watch: {
        search: function () {
            this.searchItem();
        },
        //seaDonated 一變動 就推資料進去 LS
        seaDonated: function(){
            let donatedStr =JSON.stringify(this.seaDonated);
            localStorage.setItem('seaDonatedList',donatedStr);
        }
    },

    methods: {
        searchItem() {
            const vm = this;
            //搜尋功能  名字比對輸入文字 回傳符合項目
            vm.filterItem = vm.seaData.filter(item => {
                if (item['name']["name-TWzh"].match(vm.search)) {
                    return item
                };
            });
        },

        // //紀錄捐贈與否
        donate(id) {
            let vm = this;
            let newIndex =vm.seaData.findIndex((item)=>{
                return item.id == id
            })
            vm.seaData[newIndex].donated = !vm.seaData[newIndex].donated;
            vm.seaDonated=[];
            vm.seaData.forEach(
                (item,newIndex) =>{ 
                if(item.donated){
                    vm.seaDonated.push(newIndex)
                }
            })
        },

        getDonated(){
            let vm = this;
            vm.seaDonated =JSON.parse(localStorage.getItem('seaDonatedList'));
            //更新已捐贈物品
            vm.seaDonated.forEach(
                item => vm.seaData[item].donated = true
            );
        },

        getSeaData() {
            seaData()
                .then(res => {
                    console.log(res.data);
                    let vm = this;

                    //從物件取出陣列
                    let key = Object.keys(res.data);
                    vm.seaData = key.map(
                        item => res.data[item]
                    );

                    //新增 捐贈確認項目
                    //得用強制寫入使 donated 有響應功能
                    vm.seaData.forEach(
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
        this.getSeaData();
    },


});