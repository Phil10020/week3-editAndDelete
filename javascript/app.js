console.clear()

import{ createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp(
    {
      data(){
          return{
              apiUrl:'https://vue3-course-api.hexschool.io/v2',
              user:{
                  username:'',
                  password:'',
              }
          }
      }  ,
      methods: {
          login(){
              const api=`${this.apiUrl}/admin/signin`;

              axios.post(api,this.user).then((res)=>{
                const { token,expired }=res.data;
                //console.log(res.data.message);
                //   儲存token,expires設定有效時間 ---方法
                document.cookie=`hexToken=${token};expires=${new Date(expired)}; path=/`;

                // 轉址
                window.location='products.html';
              }
              )
              .catch((err)=>{
                //   api文件中的message會顯示登入成功或失敗
                  alert(err.data.message);
              });
          },
      },
    },
).mount('#app');