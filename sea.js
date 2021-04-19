import {
    seaData
} from "./api.js";

Vue.config.devtools = true;

var app = new Vue({
    el: '#app',
    data: {
        seaData: [],
        filterItem: [],
        filterMonth: [],
        seaDonated: [],
        search: '',
        month: '',
    },

    //搜尋監聽
    watch: {
        //seaDonated 一變動 就推資料進去 LS
        seaDonated: function () {
            let donatedStr = JSON.stringify(this.seaDonated);
            localStorage.setItem('seaDonatedList', donatedStr);
        },
        month: function(){
            let vm =this;
            vm.monthSearch();
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
            //搜尋後回到置頂
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        },

        monthSearch(){
            let vm= this;
            vm.cleanSearch();
            vm.filterMonth = this.seaData.filter(item=> {
                //                                                       傳入月份為字串，須轉為NUM
                if (item["availability"]["month-array-northern"].includes(parseInt(vm.month))) {
                    return item
                };
            });
            vm.filterItem = vm.filterMonth;
        },

        cleanSearch() {
            const vm = this;
            vm.search = '';
            vm.filterItem = '';
        },

        // //紀錄捐贈與否
        donate(id) {
            let vm = this;
            let newIndex = vm.seaData.findIndex((item) => {
                return item.id == id
            })
            vm.seaData[newIndex].donated = !vm.seaData[newIndex].donated;
            vm.seaDonated = [];
            vm.seaData.forEach(
                (item, newIndex) => {
                    if (item.donated) {
                        vm.seaDonated.push(newIndex)
                    }
                })
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
        },

        //從 LS 取出捐贈紀錄
        getDonated() {
            let vm = this;
            vm.seaDonated = JSON.parse(localStorage.getItem('seaDonatedList'));
            //更新已捐贈物品
            vm.seaDonated.forEach(
                item => vm.seaData[item].donated = true
            );
        },
    },

    created() {
        this.getSeaData();
    },


});