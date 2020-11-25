# Bulanık Boid Algoritması

Boid algoritması, çok sayıda basit robotların sürü halinde hareket edebilmelerini sağlamaktadır. Bu algoritmanın 3 temel kuralı vardır:

- Birleşme kuralı, birleşme alanı içinde algılanan komşuların konumlarına göre merkezlerine doğru hareketi sağlayacak bir çekme kuvvet vektör oluşturmadır. Bu kural sürüye dâhil olma veya yaklaşma için kullanılmaktadır.

- Hizalanma kuralı, ise birleşme ve ayrılma bölgeleri arasında tanımlı olan bir alanda sürünün aynı yönde veya aynı hedefe doğru hareket etmesi için komşuların hız vektörüne uyum sağlaması için oluşturulan bir kuvvet vektörüdür.

- Ayrılma kuralı, ayrılma için tanımlanmış bölgede algılanan komşu bireylerden uzaklaşma amacıyla oluşturulan itme kuvvet vektörüdür.

![](_media/boid.png)

Robotların boid bölge sınırları hareket yeteneği, sensörlerin algılama mesafesi, kullanıcının sürüdeki istediği sıklık, haberleşme kapsama alanı vb. parametrelere bağlı olarak değişmektedir.

Boid algoritmasıyla ilgili daha fazla bilgiye buradan ulaşabilirsiniz:

[Ben Eater | Boid Algoritm](https://eater.net/boids)

[Ben Eater | Boids | Github](https://github.com/beneater/boids)

[Boids | Pseudocode](http://www.kfish.org/boids/pseudocode.html)

https://dergipark.org.tr/tr/pub/politeknik/issue/49017/481177

Bu çalışma aşağıdaki makaleden yola çıkarak hazırlanmıştır:

[Seçkin A.Ç., Özek A. ve Karpuz C., “Çoklu robotlarda işbirlikli davranışların karşılaştırılması ve bulanık mantık yaklaşımı”, Politeknik Dergisi, 22(4): 913-919, (2019).](https://dergipark.org.tr/tr/pub/politeknik/issue/49017/481177)
