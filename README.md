## Gereksinimler
- NodeJS
- NPM (Node Package Manager)
- Yarn
- İnternet bağlantısı

## Kurulum
1. ``npm install --global yarn`` komutu çalıştırılarak Yarn kurulur.
2. ``backend`` klasörü içerisinde ``yarn install`` komutu çalıştırılır.
3. ``frontend`` klasörü içerisinde ``yarn install`` komutu çalıştırılır.

Böylece frontend ve backend için gerekli olan paketler indirilir. İndirme işleminin yapılabilmesi için internet bağlantınızın bulunması gerekmektedir.

**ÖNEMLİ UYARI:** Backend port 3001/tcp, frontend port 3000/tcp üzerinde çalışmaktadır. Uygulamayı çalıştırmadan önce bu portlarda çalışan herhangi bir uygulama olmaması dikkat ediniz!

## Uygulamayı Çalıştırma
Uygulamanın backend'i ile frontend'i farklı portlarda çalışmaktadır. Dolayısıyla 2 farklı komut satırı ile aracılığı ile backend ve frontend çalıştırılır.

İlk komut satırında backend'i başlatmak için ``backend`` klösürü içerisinde ``yarn start`` komutu çalıştırılır.
Diğer komut satırında da frontend'i başlatmak için ``frontend`` klösürü içerisinde ``yarn start`` komutu çalıştırılır.
