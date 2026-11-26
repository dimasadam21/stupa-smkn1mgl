/* ==========================================================================
   STUPA SMKN 1 Magelang - Structured Content & Academic-Poetic Copy
   ========================================================================== */

window.STUPA_DATA = {
    heroSlides: [
        {
            id: 'hero-1',
            tag: 'Ekspedisi Riset & Konservasi',
            title: 'Meniti Kabut Merbabu: Pemetaan Vegetasi Endemik dan Penjagaan Mata Air Lereng Tengah',
            description: 'Ketika langkah kaki para pelajar teknik menyatu dengan denyut nadi pegunungan—mengukur debit air dengan presisi nalar dan merawat rimba dengan ketulusan hati.',
            image: 'assets/images/hero-merbabu.jpg',
            date: '24 November 2026',
            author: 'Divisi Konservasi & Riset Ekologi STUPA',
            content: `
                <p class="lead fw-semibold text-teal">Di ketinggian tempat awan beristirahat, kami belajar bahwa ilmu pengetahuan sejati tidak pernah berhenti di ruang kelas—ia bernapas bersama lumut, embun, dan akar-akar tua pegunungan.</p>
                <p>Tim Ekspedisi STUPA SMKN 1 Magelang melaksanakan misi pendataan keanekaragaman hayati dan pemetaan koordinat mata air di koridor sabana dan hutan pegunungan lereng Gunung Merbabu. Berbekal kompas bidik, GPS geodetik portabel, serta sensor kualitas air rakitan siswa jurusan teknik, tim mencatat tujuh titik resapan krusial yang menjadi penyangga kehidupan warga lereng.</p>
                <p>Setiap catatan lapangan dirangkum menjadi basis data terbuka bagi masyarakat sekitar dan pengelola taman nasional—menegaskan ikrar STUPA bahwa kecakapan teknik harus selalu bersekutu dengan kelestarian semesta.</p>
            `
        },
        {
            id: 'hero-2',
            tag: 'Diklatsar Angkatan XXXIV',
            title: 'Menempa Jiwa Teknokrat yang Rendah Hati di Hadapan Alam: Pendidikan Dasar STUPA 2026',
            description: 'Bukan untuk menaklukkan puncak tertinggi, melainkan menundukkan ego diri, merawat solidaritas, dan mengasah ketangguhan karakter di bawah naungan pinus.',
            image: 'assets/images/hero-diklatsar.jpg',
            date: '16 November 2026',
            author: 'Panitia Diklatsar & Dewan Kehormatan STUPA',
            content: `
                <p class="lead fw-semibold text-teal">Di bawah temaram lentera perkemahan dan dinginnya angin malam lereng Sumbing, para calon anggota muda STUPA mempelajari bahasa alam melalui peta topografi, simpul tali, dan disiplin kerja sama.</p>
                <p>Pendidikan dan Latihan Dasar (Diklatsar) Angkatan XXXIV dirancang dengan pendekatan akademik-humanis: memadukan navigasi darat berbasis koordinat UTM, manajemen perjalanan berisiko terukur, pertolongan pertama gawat darurat lapangan (PPGD), hingga etika <em>Leave No Trace</em>.</p>
                <p>Setiap lulusan Diklatsar tidak sekadar menyandang slayer kebanggaan, tetapi memikul amanah moral sebagai duta ekologis di lingkungan SMKN 1 Magelang.</p>
            `
        },
        {
            id: 'hero-3',
            tag: 'Aksi Lestari DAS Progo',
            title: 'Dari Bengkel Teknik Menuju Aliran Sungai: Pemantauan Kualitas Air dan Reboisasi Bantaran',
            description: 'Mengubah kecemasan ekologis menjadi kerja nyata—menanam bibit pohon asli Nusantara dan menguji parameter fisika-kimia air bersama warga Magelang.',
            image: 'assets/images/hero-konservasi.jpg',
            date: '09 November 2026',
            author: 'Divisi Lingkungan Hidup & Pengabdian Masyarakat',
            content: `
                <p class="lead fw-semibold text-teal">Air adalah cermin peradaban; ketika sungai jernih, di sanalah masa depan generasi bertumbuh tanpa rasa gentar.</p>
                <p>Sebanyak 42 anggota aktif STUPA bersama warga bantaran hulu anak Sungai Progo menanam 350 bibit beringin, gayam, dan bambu petung sebagai sabuk hijau penahan erosi. Di saat yang sama, tim melakukan pengukuran pH, TDS, dan kekeruhan air secara berkala.</p>
                <p>Kolaborasi lintas jurusan di SMKN 1 Magelang ini membuktikan bahwa keterampilan teknik terapan mampu menghadirkan solusi konkret bagi ketahanan lingkungan lokal.</p>
            `
        }
    ],

    services: [
        {
            id: 'srv-diklatsar',
            icon: 'fa-compass',
            title: 'Pendaftaran Diklatsar',
            subtitle: 'Portal seleksi & penerimaan anggota muda STUPA',
            badge: 'Keanggotaan',
            description: 'Bergabunglah bersama keluarga besar Siswa Siswi Teknik Satu Pecinta Alam (STUPA) SMKN 1 Magelang. Tempa ketangguhan jiwa, keilmuan alam bebas, dan kepedulian ekologis.',
            actionType: 'form',
            fields: [
                { name: 'nama', label: 'Nama Lengkap', type: 'text', placeholder: 'Contoh: Arjuna Pratama' },
                { name: 'kelas', label: 'Kelas & Kompetensi Keahlian', type: 'text', placeholder: 'Contoh: X Teknik Mesin 2' },
                { name: 'wa', label: 'Nomor WhatsApp Aktif', type: 'tel', placeholder: '08xxxxxxxxxx' },
                { name: 'motivasi', label: 'Refleksi Singkat Motivasi Bergabung', type: 'textarea', placeholder: 'Ceritakan semangatmu menjaga alam bersama STUPA...' }
            ],
            submitLabel: 'Kirim Pendaftaran Diklatsar'
        },
        {
            id: 'srv-logistik',
            icon: 'fa-campground',
            title: 'Pinjam Logistik',
            subtitle: 'Sirkulasi tenda, kompas, carrier & alat SAR',
            badge: 'Inventaris',
            description: 'Layanan peminjaman perlengkapan ekspedisi dan konservasi milik Sekretariat STUPA untuk kegiatan resmi sekolah, penelitian siswa, maupun misi kemanusiaan.',
            actionType: 'form',
            fields: [
                { name: 'peminjam', label: 'Nama Penanggung Jawab / Kelas', type: 'text', placeholder: 'Contoh: Nadia Kusuma (XI TKJ 1)' },
                { name: 'alat', label: 'Daftar Perlengkapan yang Dibutuhkan', type: 'text', placeholder: 'Contoh: 2 Tenda Dome, 1 Kompas Bidik, 3 Matras' },
                { name: 'tanggal', label: 'Rentang Tanggal Pemakaian', type: 'text', placeholder: 'Contoh: 12 - 14 Desember 2026' },
                { name: 'keperluan', label: 'Tujuan Kegiatan / Rute', type: 'textarea', placeholder: 'Sebutkan lokasi kegiatan dan surat tugas...' }
            ],
            submitLabel: 'Ajukan Peminjaman Alat'
        },
        {
            id: 'srv-lapor',
            icon: 'fa-shield-halved',
            title: 'Lapor Konservasi',
            subtitle: 'Pelaporan darurat lingkungan & titik rawan',
            badge: 'Tanggap Lestari',
            description: 'Kanal aspirasi warga SMKN 1 Magelang dan masyarakat sekitar untuk melaporkan titik sampah liar, pohon tumbang, pencemaran saluran air, atau kebutuhan relawan tanggap bencana.',
            actionType: 'form',
            fields: [
                { name: 'pelapor', label: 'Nama Pelapor', type: 'text', placeholder: 'Nama lengkap atau inisial' },
                { name: 'lokasi', label: 'Lokasi Kejadian / Koordinat', type: 'text', placeholder: 'Contoh: Area Taman Belakang / Jl. Cawang' },
                { name: 'kategori', label: 'Jenis Laporan', type: 'select', options: ['Penghijauan & Bibit Pohon', 'Pengelolaan Limbah / Sampah', 'Pohon Rawan / Cuaca Ekstrem', 'Edukasi Lingkungan Kelas'] },
                { name: 'detail', label: 'Uraian Pengamatan', type: 'textarea', placeholder: 'Jelaskan kondisi lapangan secara ringkas...' }
            ],
            submitLabel: 'Kirim Laporan Konservasi'
        },
        {
            id: 'srv-peta',
            icon: 'fa-map-location-dot',
            title: 'Peta Jalur Alam',
            subtitle: 'Direktori rute pendakian & elevasi Magelang',
            badge: 'Navigasi Darat',
            description: 'Ringkasan data geospasial jalur pendakian dan titik konservasi di sekitar Magelang (Merbabu, Andong, Telomoyo, Sumbing, dan Menoreh) sebagai rujukan keselamatan perjalanan.',
            actionType: 'info',
            infoList: [
                { title: 'Gn. Andong (1.726 mdpl) — Jalur Sawit & Pendem', meta: 'Tingkat: Pemula / Edukasi Navigasi • Estimasi: 2–3 Jam • Sumber Air: Pos 1 & Basecamp' },
                { title: 'Gn. Telomoyo (1.894 mdpl) — Koridor Riset Vegetasi', meta: 'Tingkat: Menengah • Fokus: Pengamatan Aves & Pengukuran Suhu Ketinggian' },
                { title: 'Gn. Merbabu (3.145 mdpl) — Jalur Suwanting & Wekas', meta: 'Tingkat: Lanjut • Wajib Simaksi Resmi TNGM & Tim Minimal 4 Personel' },
                { title: 'Perbukitan Menoreh — Jalur Trekking & Susur Sungai', meta: 'Tingkat: Pelatihan Fisik & Pemetaan Mata Air Karst' }
            ]
        },
        {
            id: 'srv-adiwiyata',
            icon: 'fa-seedling',
            title: 'Klinik Ekologi',
            subtitle: 'Bank sampah sekolah & inovasi komposter teknik',
            badge: 'Eco-Tech',
            description: 'Pusat kolaborasi hijau di SMKN 1 Magelang: integrasi bank sampah terpilah, mesin pencacah organik karya siswa teknik, dan pembibitan tanaman keras endemik.',
            actionType: 'info',
            infoList: [
                { title: 'Jadwal Setor Bank Sampah Pelajar', meta: 'Setiap Selasa & Jumat pukul 14.30 – 16.00 WIB di Green Corner SMKN 1 Magelang' },
                { title: 'Rumah Pembibitan (Nursery) STUPA', meta: 'Menyediakan bibit Pucuk Merah, Trembesi, Alpukat, dan Beringin untuk aksi tanam kelas' },
                { title: 'Audit Energi & Air Sekolah', meta: 'Monitoring bulanan oleh Tim Riset Ekologi bekerja sama dengan Pokja Adiwiyata' }
            ]
        },
        {
            id: 'srv-sekretariat',
            icon: 'fa-mountain-sun',
            title: 'Sekretariat & Posko',
            subtitle: 'Kontak pengurus, pembina & jadwal latihan rutin',
            badge: 'Informasi Resmi',
            description: 'Ruang temu gagasan dan latihan berkala STUPA SMKN 1 Magelang. Terbuka bagi siswa, alumni lintas angkatan, dan mitra organisasi pecinta alam.',
            actionType: 'info',
            infoList: [
                { title: 'Lokasi Sanggar / Sekretariat', meta: 'Kompleks Ekstrakurikuler SMKN 1 Magelang, Jl. Cawang No. 2, Magelang Selatan' },
                { title: 'Latihan Rutin Mingguan', meta: 'Rabu (Materi Kelas & Navigasi, 15.30 WIB) & Sabtu (Fisik / Mountaineering, 07.30 WIB)' },
                { title: 'Kontak Cepat Pembina & Ketua Umum', meta: 'Email: stupa@smkn1magelang.sch.id • Posko Siaga: +62 812-3456-7890' }
            ]
        }
    ],

    videos: [
        {
            id: 'vid-main',
            title: 'Selamatkan Mata Air Lereng Tengah, Sebelum Kita Kehilangan Lebih Dari Sekadar Aliran!',
            date: 'Dokumenter Ekspedisi • 18 November 2026',
            thumb: 'assets/images/video-bg-danau.jpg',
            summary: 'Film dokumenter pendek karya Divisi Media STUPA SMKN 1 Magelang yang merekam perjalanan menyusuri danau vulkanik dan mata air pegunungan Jawa Tengah, memadukan data hidrologi sederhana dengan refleksi puitis generasi muda teknik.',
            highlights: ['Durasi: 08:42 Menit', 'Lokasi: Lereng Merbabu – Telomoyo – Kledung', 'Narator: Tim Ekspedisi Angkatan XXXIII']
        },
        {
            id: 'vid-1',
            title: 'Simulasi Vertical Rescue & Teknik Tali-Temali Medan Terjal di Tebing Latih Magelang',
            date: '13 Oktober 2026',
            thumb: 'assets/images/news-tebing.jpg',
            summary: 'Dokumentasi latihan gabungan teknik ascending, descending, dan sistem katrol pengangkatan korban di medan tebing kapur dengan standar keselamatan ganda.',
            highlights: ['Durasi: 05:18 Menit', 'Divisi: Mountaineering & SAR', 'Instruktur: Alumni STUPA & Relawan']
        },
        {
            id: 'vid-2',
            title: 'Inovasi Stasiun Cuaca Mini Tenaga Surya & Eco-Garden Pelajar SMKN 1 Magelang',
            date: '20 September 2026',
            thumb: 'assets/images/news-kampus-hijau.jpg',
            summary: 'Potret sinergi antara kompetensi teknik elektro/mesin dan ekologi: merancang pencatat suhu, kelembapan, serta irigasi tetes otomatis berbasis panel surya.',
            highlights: ['Durasi: 06:04 Menit', 'Divisi: Riset Eco-Tech', 'Kolaborasi Pokja Adiwiyata']
        },
        {
            id: 'vid-3',
            title: 'Jejak Langkah Diklatsar XXXIV: Dari Ruang Teori Menuju Kedewasaan di Rimba Pinus',
            date: '29 Agustus 2026',
            thumb: 'assets/images/hero-diklatsar.jpg',
            summary: 'Catatan visual perjalanan para calon anggota muda melewati pos navigasi malam, manajemen bivak darurat, hingga prosesi pengukuhan slayer.',
            highlights: ['Durasi: 07:15 Menit', 'Divisi: Kaderisasi', 'Lokasi: Hutan Pinus Lereng Sumbing']
        }
    ],

    news: {
        berita: [
            {
                title: 'STUPA SMKN 1 Magelang Rampungkan Pemetaan 7 Titik Mata Air Lereng Merbabu',
                date: '21 November 2026',
                image: 'assets/images/hero-merbabu.jpg',
                excerpt: 'Tim ekspedisi konservasi merilis peta koordinat digital beserta data debit aliran guna mendukung mitigasi kekeringan musim kemarau.',
                content: 'Selama tiga hari penjelajahan ilmiah, enam belas anggota STUPA menelusuri koridor hutan lindung dengan metode transek garis dan pencatatan GPS. Hasil pemetaan diserahkan kepada pengelola sumber daya air desa penyangga sebagai kontribusi nyata pelajar sekolah kejuruan.'
            },
            {
                title: 'Sinergi Sekolah Adiwiyata: Bengkel Teknik Ciptakan Pencacah Kompos Ramah Lingkungan',
                date: '19 November 2026',
                image: 'assets/images/news-kampus-hijau.jpg',
                excerpt: 'Kolaborasi anggota STUPA dan bengkel pemesinan menghasilkan mesin pengolah daun kering yang memangkas waktu pengomposan hingga separuhnya.',
                content: 'Inovasi ini lahir dari keprihatinan terhadap tumpukan serasah daun di halaman sekolah yang luas. Dengan rancangan pisau baja efisien dan motor hemat daya, pupuk organik yang dihasilkan kini menghidupi seluruh taman produktif SMKN 1 Magelang.'
            },
            {
                title: 'Latihan Gabungan SAR & Vertical Rescue Perkuat Kesiapsiagaan Relawan Muda Magelang',
                date: '14 November 2026',
                image: 'assets/images/news-tebing.jpg',
                excerpt: 'Melatih ketepatan simpul, komunikasi lapangan, dan ketenangan berpikir di bawah tekanan medan vertikal.',
                content: 'Sebanyak 30 personel mengikuti simulasi evakuasi di tebing kapur bersama instruktur senior. Fokus utama latihan adalah zero-accident protocol dan efisiensi sistem penambatan (anchoring).'
            },
            {
                title: '350 Bibit Pohon Endemik Ditanam di Sepanjang Sempadan Hulu Anak Sungai Progo',
                date: '09 November 2026',
                image: 'assets/images/hero-konservasi.jpg',
                excerpt: 'Aksi penghijauan terpadu melibatkan pelajar lintas jurusan, guru pendamping, dan komunitas peduli sungai Magelang.',
                content: 'Penanaman dilakukan menggunakan teknik lubang biopori bernutrisi kompos sekolah. Setiap bibit diberi penanda koordinat untuk dipantau tingkat kelangsungan hidupnya selama enam bulan ke depan.'
            },
            {
                title: 'Pengukuhan Pengurus Baru STUPA Periode 2026/2027: Mengusung Semangat Sains & Etika Rimba',
                date: '02 November 2026',
                image: 'assets/images/hero-diklatsar.jpg',
                excerpt: 'Estafet kepemimpinan resmi berpindah dengan komitmen memperluas literasi ekologi digital dan keselamatan pendakian pelajar.',
                content: 'Upacara serah terima jabatan berlangsung khidmat di aula terbuka sekolah, dihadiri oleh Pembina Ekstrakurikuler, perwakilan OSIS, serta alumni lintas generasi STUPA.'
            },
            {
                title: 'Refleksi Senja di Telaga Pegunungan: Mengapa Pelajar Teknik Membutuhkan Keheningan Alam',
                date: '27 Oktober 2026',
                image: 'assets/images/video-bg-danau.jpg',
                excerpt: 'Esai lapangan tentang keseimbangan antara kecerdasan mekanis di bengkel kerja dan kepekaan nurani di alam terbuka.',
                content: 'Teknologi tanpa kebijaksanaan ekologis hanya akan mempercepat kelelahan bumi. Melalui kegiatan alam bebas, siswa teknik diajak membaca ritme alam secara utuh sebelum merancang karya.'
            }
        ],
        ekspedisi: [
            {
                title: 'Laporan Ekspedisi Puncak Kenteng Songo: Pengukuran Suhu Mikro & Kecepatan Angin Puncak',
                date: '22 November 2026',
                image: 'assets/images/hero-merbabu.jpg',
                excerpt: 'Pendakian berbasis riset ringan mencatat variasi temperatur ekstrem antara sabana pagi dan malam hari.',
                content: 'Ekspedisi dilaksanakan melalui jalur Suwanting dengan membawa anemometer digital dan logger suhu rakitan siswa. Data menjadi bahan ajar menarik pada kelas navigasi dan manajemen hipotermia.'
            },
            {
                title: 'Ekspedisi Susur Sungai & Audit Makroinvertebrata Penanda Kesehatan Air',
                date: '15 November 2026',
                image: 'assets/images/hero-konservasi.jpg',
                excerpt: 'Menggunakan indikator hayati alami untuk membaca tingkat kejernihan ekosistem sungai di kaki perbukitan.',
                content: 'Keberadaan larva capung dan kepiting sungai tertentu menunjukkan kualitas oksigen terlarut yang masih baik pada segmen hulu, sekaligus menjadi peringatan dini di titik hilir permukiman.'
            },
            {
                title: 'Pemetaan Jalur Evakuasi Darurat Koridor Hutan Pinus Lereng Sumbing Timur',
                date: '04 November 2026',
                image: 'assets/images/hero-diklatsar.jpg',
                excerpt: 'Tim navigasi STUPA menyusun peta lintasan aman beserta titik temu komunikasi radio VHF.',
                content: 'Seluruh koordinat persimpangan krusial didokumentasikan dalam format GPX dan peta cetak tahan air agar siap digunakan oleh tim penjelajah pemula.'
            }
        ],
        pengumuman: [
            {
                title: 'Pembukaan Pendaftaran Calon Anggota Muda Diklatsar STUPA Angkatan XXXV',
                date: '25 November 2026',
                image: 'assets/images/hero-diklatsar.jpg',
                excerpt: 'Terbuka bagi seluruh siswa-siswi kelas X dan XI SMKN 1 Magelang. Pendaftaran daring dibuka hingga 15 Desember 2026.',
                content: 'Calon peserta wajib melengkapi formulir persetujuan orang tua, surat keterangan sehat, serta mengikuti sesi pengenalan materi ruang selama tiga pekan sebelum kegiatan lapangan.'
            },
            {
                title: 'Surat Edaran Prosedur Peminjaman Logistik & Peralatan Ekspedisi Semester Genap',
                date: '18 November 2026',
                image: 'assets/images/news-tebing.jpg',
                excerpt: 'Pembaruan tata tertib inventarisasi guna memastikan kelayakan seluruh alat panjat, tenda, dan perangkat navigasi.',
                content: 'Setiap peminjaman wajib diajukan minimal H-5 melalui formulir portal layanan atau langsung menemui Koordinator Logistik di Sekretariat STUPA.'
            },
            {
                title: 'Jadwal Pemeriksaan Kesehatan & Tes Kebugaran Berkala Anggota Aktif',
                date: '10 November 2026',
                image: 'assets/images/news-kampus-hijau.jpg',
                excerpt: 'Persiapan fisik terukur menjelang agenda ekspedisi akhir tahun dan bakti sosial lereng Merapi.',
                content: 'Tes meliputi lari ketahanan 2.400 meter, kekuatan inti, serta evaluasi riwayat medis guna menjamin keselamatan seluruh personel di lapangan.'
            }
        ],
        agenda: [
            {
                title: 'Bakti Ekologi & Penanaman 500 Pohon Memperingati Hari Menanam Pohon Indonesia',
                date: '28 November 2026',
                image: 'assets/images/hero-konservasi.jpg',
                excerpt: 'Kegiatan terbuka bersama seluruh warga SMKN 1 Magelang di kawasan sabuk hijau lereng Telomoyo.',
                content: 'Titik kumpul di lapangan utama sekolah pukul 06.30 WIB. Peserta dimohon membawa botol minum guna ulang (tumbler) sebagai wujud kampanye minim sampah plastik.'
            },
            {
                title: 'Workshop Sekolah: Membaca Peta Rupabumi & Navigasi Kompas untuk Pemula',
                date: '06 Desember 2026',
                image: 'assets/images/hero-diklatsar.jpg',
                excerpt: 'Kelas terbuka yang membahas teknik resection, intersection, dan pembacaan garis kontur pegunungan.',
                content: 'Bertempat di Ruang Multimedia SMKN 1 Magelang pukul 08.00–12.00 WIB. Terbuka untuk anggota Pramuka, PMR, dan siswa umum.'
            },
            {
                title: 'Simulasi Pertolongan Pertama Gawat Darurat (PPGD) & Penanganan Hipotermia',
                date: '13 Desember 2026',
                image: 'assets/images/news-tebing.jpg',
                excerpt: 'Pelatihan intensif bersama relawan medis lapangan untuk meningkatkan respons cepat di medan terpencil.',
                content: 'Materi meliputi pembidaian darurat, teknik evakuasi tandu improvisasi, dan tata laksana suhu tubuh rendah di ketinggian.'
            }
        ],
        artikel: [
            {
                title: 'Etika Leave No Trace: Memuliakan Alam Tanpa Meninggalkan Jejak Kesombongan',
                date: '23 November 2026',
                image: 'assets/images/video-bg-danau.jpg',
                excerpt: 'Tujuh prinsip luhur penggiat alam bebas yang menjadi napas setiap perjalanan anggota STUPA SMKN 1 Magelang.',
                content: 'Alam bukanlah panggung swafoto yang boleh dikotori oleh jejak plastik atau vandalisme. Prinsip Leave No Trace mengajarkan kita pulang dengan membawa seluruh sampah, menyimpan kenangan dalam ingatan, dan membiarkan alam tetap sebagaimana asalnya.'
            },
            {
                title: 'Dari Halaman Sekolah Menuju Kesadaran Iklim: Peran Strategis Pelajar Kejuruan',
                date: '17 November 2026',
                image: 'assets/images/news-kampus-hijau.jpg',
                excerpt: 'Mengapa siswa teknik memegang kunci penting dalam transisi energi bersih dan pengelolaan limbah terpadu.',
                content: 'Berbekal pemahaman manufaktur, kelistrikan, dan rekayasa terapan, siswa SMK berada di garis depan penciptaan teknologi tepat guna bagi kelestarian lingkungan.'
            },
            {
                title: 'Anatomi Keselamatan Pendakian: Mengapa Persiapan Ilmu Lebih Penting dari Keberanian',
                date: '11 November 2026',
                image: 'assets/images/hero-merbabu.jpg',
                excerpt: 'Keberanian tanpa perhitungan hanya melahirkan bahaya; pengetahuan navigasi dan cuaca adalah pelindung sejati.',
                content: 'Artikel ini mengulas pentingnya mempelajari prakiraan cuaca pegunungan, manajemen logistik air, serta disiplin berbalik arah ketika kondisi alam tidak lagi bersahabat.'
            }
        ]
    },

    publications: [
        {
            id: 'pub-1',
            badge: 'Modul Diklatsar',
            title: 'Buku Saku Navigasi Darat, Kompas Bidik & Pemetaan Kontur',
            year: 'Edisi 2026',
            pages: '64 Hal',
            gradient: 'linear-gradient(145deg, #005950 0%, #008b7d 100%)',
            summary: 'Panduan praktis membaca peta Rupabumi Indonesia (RBI), menghitung azimuth dan back-azimuth, menentukan posisi melalui teknik resection, serta membaca bentang alam lembah dan punggungan.'
        },
        {
            id: 'pub-2',
            badge: 'Kode Etik & AD/ART',
            title: 'Pedoman Luhur & Kode Etik Pecinta Alam STUPA SMKN 1 Magelang',
            year: 'Revisi VII • 2026',
            pages: '42 Hal',
            gradient: 'linear-gradient(145deg, #164b47 0%, #3a716e 100%)',
            summary: 'Memuat naskah Kode Etik Pecinta Alam Indonesia, falsafah organisasi STUPA, struktur kepengurusan, serta tata tertib keselamatan berkegiatan di alam bebas.'
        },
        {
            id: 'pub-3',
            badge: 'Jurnal Ekspedisi',
            title: 'Monograf Mata Air & Keanekaragaman Flora Lereng Merbabu',
            year: 'Vol. IV • 2026',
            pages: '88 Hal',
            gradient: 'linear-gradient(145deg, #004e46 0%, #00a896 100%)',
            summary: 'Laporan hasil pengamatan lapangan tim riset STUPA mengenai sebaran tumbuhan pegunungan, tutupan kanopi, dan kualitas air di tujuh titik mata air penyangga.'
        },
        {
            id: 'pub-4',
            badge: 'Panduan SAR',
            title: 'Prosedur Tetap PPGD Lapangan, Evakuasi & Manajemen Hipotermia',
            year: 'Edisi 2026',
            pages: '56 Hal',
            gradient: 'linear-gradient(145deg, #9e4700 0%, #F97910 100%)',
            summary: 'Referensi cepat penanganan cedera muskuloskeletal, gigitan satwa, luka bakar, serta protokol pertolongan darurat pada kondisi cuaca ekstrem pegunungan.'
        },
        {
            id: 'pub-5',
            badge: 'Eco-Tech',
            title: 'Rancang Bangun Komposter Mekanis & Sensor Suhu Tenaga Surya',
            year: 'Karya Teknik • 2026',
            pages: '48 Hal',
            gradient: 'linear-gradient(145deg, #0b5345 0%, #1abc9c 100%)',
            summary: 'Dokumentasi teknis proyek kolaborasi siswa teknik SMKN 1 Magelang dalam mendukung program Adiwiyata Mandiri melalui teknologi ramah lingkungan.'
        },
        {
            id: 'pub-6',
            badge: 'Mountaineering',
            title: 'Atlas Simpul Tali, Penambatan Tebing & Keselamatan Vertical Rescue',
            year: 'Edisi 2025',
            pages: '52 Hal',
            gradient: 'linear-gradient(145deg, #1b4332 0%, #40916c 100%)',
            summary: 'Ilustrasi langkah demi langkah simpul Figure of Eight, Bowline, Clove Hitch, hingga sistem belay dan rappelling standar keselamatan ganda.'
        },
        {
            id: 'pub-7',
            badge: 'Kurikulum Alam',
            title: 'Silabus Pendidikan Dasar & Pembinaan Karakter Anggota Muda',
            year: 'Angkatan XXXIV',
            pages: '38 Hal',
            gradient: 'linear-gradient(145deg, #003d37 0%, #007a6e 100%)',
            summary: 'Rangkaian materi kelas dan praktik lapangan bagi calon anggota STUPA yang mengintegrasikan kedisiplinan, kepemimpinan, dan kecintaan terhadap tanah air.'
        },
        {
            id: 'pub-8',
            badge: 'Laporan Tahunan',
            title: 'Refleksi Satu Tahun Pengabdian Ekologis STUPA untuk Magelang Lestari',
            year: 'Laporan 2025/2026',
            pages: '74 Hal',
            gradient: 'linear-gradient(145deg, #2d6a4f 0%, #52b788 100%)',
            summary: 'Rekam jejak kegiatan penanaman pohon, aksi bersih gunung, edukasi sekolah dasar, serta partisipasi tanggap bencana selama satu tahun kepengurusan.'
        }
    ],

    procedures: [
        {
            id: 'proc-1',
            badge: 'Alur Seleksi & Diklatsar Anggota',
            icon: 'fa-user-check',
            steps: [
                { title: 'Registrasi Daring & Izin Orang Tua', desc: 'Mengisi formulir portal layanan dan menyerahkan surat persetujuan wali murid serta keterangan sehat.' },
                { title: 'Kelas Akademik & Pembinaan Fisik', desc: 'Mengikuti 3 pekan materi navigasi darat, etika rimba, PPGD, dan pembinaan ketahanan jasmani.' },
                { title: 'Pengembaraan Lapangan (Diklatsar)', desc: 'Praktik lapangan terpadu bersama pembina dan tim medis di lereng pegunungan Jawa Tengah.' },
                { title: 'Pengukuhan & Nomor Registrasi Anggota', desc: 'Penyerahan slayer kebanggaan STUPA dan penetapan penugasan di divisi pilihan.' }
            ]
        },
        {
            id: 'proc-2',
            badge: 'Prosedur Peminjaman Logistik & Izin Ekspedisi',
            icon: 'fa-toolbox',
            steps: [
                { title: 'Pengajuan Rencana Perjalanan (ROP)', desc: 'Menyampaikan proposal rute, daftar personel, serta analisis mitigasi risiko minimal H-7 keberangkatan.' },
                { title: 'Verifikasi Pembina & Koordinator Logistik', desc: 'Pemeriksaan kelaikan perlengkapan tenda, kompas, P3K, dan persetujuan pembina ekstrakurikuler.' },
                { title: 'Serah Terima Alat & Check-In Basecamp', desc: 'Pencatatan kondisi alat sebelum berangkat serta pelaporan posisi berkala selama ekspedisi.' },
                { title: 'Pengembalian Bersih & Laporan Evaluasi', desc: 'Logistik dikembalikan dalam keadaan kering/terawat maksimal H+2 disertai jurnal catatan lapangan.' }
            ]
        }
    ],

    partners: [
        { label: 'SMKN 1 Magelang', icon: 'fa-school', href: '#top' },
        { label: 'TNGM Merbabu', icon: 'fa-tree', href: '#layanan-stupa' },
        { label: 'Basarnas & BPBD Magelang', icon: 'fa-life-ring', href: '#layanan-stupa' },
        { label: 'Pokja Adiwiyata', icon: 'fa-award', href: '#layanan-stupa' },
        { label: 'Forum Sispala Jateng', icon: 'fa-compass', href: '#layanan-stupa' },
        { label: 'Komunitas Peduli Progo', icon: 'fa-water', href: '#layanan-stupa' }
    ],

    siteMeta: {
        brandTitle: 'STUPA — Siswa Siswi Teknik\nSatu Pecinta Alam',
        brandSubtitle: 'SMKN 1 Magelang • Lestari & Berilmu',
        secTitleLayanan: 'Layanan & Kanal Digital STUPA',
        secLeadLayanan: 'Ruang layanan terpadu Siswa Siswi Teknik Satu Pecinta Alam SMKN 1 Magelang—dirancang praktis, transparan, dan mudah diakses bagi siswa, pembina, maupun mitra lingkungan.',
        secTitleBerita: 'BERITA & INFORMASI',
        secTitlePublikasi: 'PUBLIKASI & MODUL EKSPEDISI',
        secTitleProsedur: 'PROSEDUR KEGIATAN & LAYANAN STUPA',
        runningText: 'Menapak Rimba dengan Nalar Ilmu, Menjaga Semesta dengan Keteguhan Hati — STUPA SMKN 1 Magelang: Tangguh di Puncak, Santun di Bumi, Unggul dalam Karya Teknik Berkelanjutan!',
        footerMotto: '“Berakar pada ilmu teknik, tumbuh dalam persaudaraan, berbuah pada kelestarian semesta.”',
        secretariatName: 'Sanggar STUPA — SMKN 1 Magelang',
        addressLine1: 'Jl. Cawang No. 2, Jurangombo Utara',
        addressLine2: 'Kec. Magelang Selatan, Kota Magelang 56123',
        phone: '(0293) 362172 • Posko: +62 812-3456-7890',
        email: 'stupa@smkn1magelang.sch.id',
        copyright: '© 2026 Hak Cipta STUPA (Siswa Siswi Teknik Satu Pecinta Alam) — SMK Negeri 1 Magelang',
        instagramUrl: '#kontak-footer',
        youtubeUrl: '#kontak-footer',
        tiktokUrl: '#kontak-footer'
    }
};
