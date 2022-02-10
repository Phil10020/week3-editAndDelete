console.clear();
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal=null ;
let delProductModal=null ;

createApp({
    data() {
        return {
            apiUrl:'https://vue3-course-api.hexschool.io/v2',
            apiPath:'phil',
            products:[],
            isNew:false,
            tempProduct:{
                imagesUrl:[],
            }
        }
    },
    mounted() {
        // bs5 modal初始化
        productModal=new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false 
        });

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });

        // 取出token
        const token =document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;
        
        this.checkAdmin();
    },
    methods: {
        checkAdmin(){
            const url=`${this.apiUrl}/api/user/check`;
            axios.post(url)
            .then(()=>{
                this.getData();
            })
            // 資料輸入錯誤則轉址回登入畫面
            .catch((err)=>{
                alert(err.data.message);
                window.location='index.html';
            })
        },

        getData(){
            // 注意api格式...products
            const url=`${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
            axios.get(url).then((res)=>{
                this.products=res.data.products;

            }).catch((err)=>{
                alert(err.data.message);
            })
        },

        updateProduct(){
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http='post';
            // put資料時,按照api格式需要帶入id
            // !this.isNew是要符合下方edit中的put設定條件
            if(!this.isNew){
                url=`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http='put'
            };
            // 可以利用上方判斷方式切換http是需要post還是put
            // 使用{data:this.tempProduct}是按照api格式帶資料進去，否則無法發送請求
            axios[http](url,{data:this.tempProduct}).then((res)=>{
                alert(res.data.message);
                productModal.hide();
                this.getData();
            }).catch((err)=>{
                alert(err.data.message);
            })

        },

        openModal(isNew,item){
            if(isNew==='new'){
                this.tempProduct={
                    // 將圖片設定為空值
                    imagesUrl:[],
                };
                this.isNew=true;
                productModal.show();
            }else if (isNew==='edit'){
                // 淺拷貝，避免同步更新畫面資料
                this.tempProduct={...item};
                this.isNew=false;
                productModal.show();
            }else if (isNew === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show()
            }
        },

        delProductModal(){
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            
            axios.delete(url).then((res)=>{
                alert(res.data.message);
                delProductModal.hide();
                this.getData();
            }).catch((err)=>{
                alert(err.data.message);
            })
        
        },
        createImages(){
            this.tempProduct.imagesUrl=[];
            this.tempProduct.imagesUrl.push('')
        },
    },
}).mount('#app');