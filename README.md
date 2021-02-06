# React Query examples

Simple projects that shows the usage of React Query
- Crypto Market
- Mama Muda
- Crypto News 

React Query Merupakan library yang bisa digunakan untuk keperluan data fetching. kelebihan React Query dibandingan dengan yang sudah ada seperti Redux, dll, React Query memiliki keunggulan di data sinkronisasi. Problem di front-end, bagaimana cara untuk membuat data agar tetap sinkron dengan di server, sedangkan data di server tidak bisa di kontrol di front-end, React Query bisa menyelesaikan masalah ini. 

Kita melakukan penyelesaian 2 contoh kasus, crypto market & mama muda.

Cara Kerja React Query:
1. Query => http method GET
2. Mutation => http method POST
3. Cache => temporary storage

<QueryClientProvide>
	<App/>
</QueryClientProvide>


Optimistic Update, update/action yang harus dilakukan di UI/Frontend sebelum menerima response dari server.