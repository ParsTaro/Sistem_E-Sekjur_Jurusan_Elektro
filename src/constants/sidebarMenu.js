import {
  Home,
  UploadCloud,
  FileClock,
  FileSearch,
  Table,
  UserPlus,
  FolderSearch,
  BadgeCheck,
  FileArchive,
  FileSignature,
  UserCog,
  ListTodo,
  Layers,
} from "lucide-react";

const iconStyle = { marginBottom: 3, marginRight: 7 };

export const menuByRole = {
  mahasiswa: [
    {
      label: "Beranda",
      path: "/mahasiswa/landing",
      icon: <Home size={20} style={iconStyle} />
    },
    {
      label: "Semester Antara",
      type: "dropdown",
      icon: <Layers size={20} style={iconStyle} />,
      children: [
        {
          label: "Upload Bukti Bayar",
          path: "/mahasiswa/upload",
          icon: <UploadCloud size={18} style={iconStyle} />
        },
        {
          label: "Riwayat Pengajuan",
          path: "/mahasiswa/riwayat",
          icon: <FileClock size={18} style={iconStyle} />
        },
      ],
    },
    {
      label: "Pengajuan Cuti",
      type: "dropdown",
      icon: <FileSignature size={20} style={iconStyle} />,
      children: [
        {
          label: "Form Cuti",
          path: "/mahasiswa/cuti",
          icon: <FileSignature size={18} style={iconStyle} />
        },
      ],
    },
  ],

  sekjur: [
    {
      label: "Beranda",
      path: "/sekjur/landing",
      icon: <Home size={20} style={iconStyle} />
    },
    {
      label: "Manajemen User",
      path: "/sekjur/user",
      icon: <UserCog size={18} style={iconStyle} />
    },
    {
      label: "Manajemen Matakuliah",
      path: "/sekjur/matakuliah",
      icon: <ListTodo size={18} style={iconStyle} />
    },
    {
      label: "Semester Antara",
      type: "dropdown",
      icon: <Layers size={20} style={iconStyle} />,
      children: [
        {
          label: "Validasi Pembayaran",
          path: "/sekjur/validasi",
          icon: <FileSearch size={18} style={iconStyle} />
        },
        {
          label: "Rekap Nilai",
          path: "/sekjur/rekap",
          icon: <Table size={18} style={iconStyle} />
        },
      ],
    },
    {
      label: "Pengajuan Cuti",
      type: "dropdown",
      icon: <FileSignature size={20} style={iconStyle} />,
      children: [
        {
          label: "Form Cuti",
          path: "/sekjur/cuti",
          icon: <FileSignature size={18} style={iconStyle} />
        },
      ],
    },
  ],

  prodi: [
    {
      label: "Beranda",
      path: "/prodi/landing",
      icon: <Home size={20} style={iconStyle} />
    },
    {
      label: "Semester Antara",
      type: "dropdown",
      icon: <Layers size={20} style={iconStyle} />,
      children: [
        {
          label: "Penugasan Dosen",
          path: "/prodi/penugasan",
          icon: <UserPlus size={18} style={iconStyle} />
        },
        {
          label: "Riwayat Penugasan",
          path: "/prodi/riwayat-penugasan",
          icon: <FolderSearch size={18} style={iconStyle} />
        },
      ],
    },
    {
      label: "Pengajuan Cuti",
      type: "dropdown",
      icon: <FileSignature size={20} style={iconStyle} />,
      children: [
        {
          label: "Form Cuti",
          path: "/prodi/cuti",
          icon: <FileSignature size={18} style={iconStyle} />
        },
      ],
    },
  ],

  dosen: [
    {
      label: "Beranda",
      path: "/dosen/landing",
      icon: <Home size={20} style={iconStyle} />
    },
    {
      label: "Semester Antara",
      type: "dropdown",
      icon: <Layers size={20} style={iconStyle} />,
      children: [
        {
          label: "Penilaian Mahasiswa",
          path: "/dosen/penilaian",
          icon: <BadgeCheck size={18} style={iconStyle} />
        },
        {
          label: "Riwayat Nilai",
          path: "/dosen/riwayat-nilai",
          icon: <FileArchive size={18} style={iconStyle} />
        },
      ],
    },
    {
      label: "Pengajuan Cuti",
      type: "dropdown",
      icon: <FileSignature size={20} style={iconStyle} />,
      children: [
        {
          label: "Form Cuti",
          path: "/dosen/cuti",
          icon: <FileSignature size={18} style={iconStyle} />
        },
      ],
    },
  ],
};
