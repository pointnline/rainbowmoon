import type { VisionPackage } from "@/types";

export const VISION_PACKAGES: VisionPackage[] = [
  {
    id: "ceo",
    icon: "◈",
    label: "미래의 CEO",
    desc: "리더로서의 비전과 성공 이미지",
    visions: [
      { text: "나만의 회사를 운영하는 CEO", query: "ceo office luxury" },
      { text: "TED 무대에서 강연하는 나", query: "ted talk stage speaker" },
      { text: "글로벌 비즈니스 미팅", query: "business meeting skyline" },
      { text: "베스트셀러 저자", query: "bestseller book author" },
      { text: "멘토링으로 후배를 키우는 리더", query: "mentoring leadership" },
      { text: "경제적 자유를 이룬 삶", query: "financial freedom luxury" },
    ],
  },
  {
    id: "travel",
    icon: "✈",
    label: "세계 여행가",
    desc: "버킷리스트 여행과 자유로운 삶",
    visions: [
      { text: "산토리니 석양 앞에서", query: "santorini sunset ocean" },
      { text: "북유럽 오로라 아래", query: "aurora northern lights" },
      { text: "뉴욕 맨해튼의 야경", query: "new york manhattan night" },
      { text: "발리 해변에서의 힐링", query: "bali beach tropical" },
      { text: "스위스 알프스 트레킹", query: "swiss alps hiking mountain" },
      { text: "일본 교토의 단풍길", query: "kyoto autumn temple" },
    ],
  },
  {
    id: "wellness",
    icon: "♡",
    label: "건강한 라이프",
    desc: "몸과 마음이 건강한 일상",
    visions: [
      { text: "매일 아침 요가로 시작하는 하루", query: "morning yoga sunrise" },
      { text: "건강한 식단과 홈쿠킹", query: "healthy food cooking" },
      { text: "자연 속 명상의 시간", query: "meditation nature peaceful" },
      { text: "마라톤 완주하는 나", query: "marathon running finish" },
      { text: "서핑을 즐기는 주말", query: "surfing ocean waves" },
      { text: "가든에서 식물 가꾸기", query: "garden plants greenhouse" },
    ],
  },
  {
    id: "creative",
    icon: "✧",
    label: "크리에이터",
    desc: "창작과 예술로 채운 삶",
    visions: [
      { text: "나만의 작업실", query: "creative studio workspace" },
      { text: "갤러리에 전시된 내 작품", query: "art gallery exhibition" },
      { text: "음악을 만드는 프로듀서", query: "music studio producer" },
      { text: "사진으로 세상을 기록", query: "photography camera travel" },
      { text: "유튜브 크리에이터로 성장", query: "content creator filming" },
      { text: "디자인으로 세상을 바꾸기", query: "design innovation modern" },
    ],
  },
  {
    id: "family",
    icon: "☾",
    label: "가족과 행복",
    desc: "사랑하는 사람들과의 따뜻한 삶",
    visions: [
      { text: "가족과 함께하는 저녁 식사", query: "family dinner warm home" },
      { text: "넓은 마당이 있는 드림 하우스", query: "dream house garden modern" },
      { text: "아이와 함께하는 캠핑", query: "family camping nature" },
      { text: "부모님께 효도 여행", query: "parents travel happy" },
      { text: "반려동물과 함께하는 일상", query: "pet dog happy lifestyle" },
      { text: "주말 가족 브런치", query: "brunch cafe morning" },
    ],
  },
];
