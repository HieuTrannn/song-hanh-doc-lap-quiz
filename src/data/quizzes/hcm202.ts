import type { QuizSet } from "@/lib/types";

export const hcm202Quiz: QuizSet = {
  id: "hcm202-doc-lap-dan-toc",
  title: "HCM202 - Tư Tưởng Hồ Chí Minh về mối quan hệ giữa Độc lập Dân tộc và Chủ Nghĩa Xã Hội",
  description: "Bộ câu hỏi về tư tưởng Hồ Chí Minh, độc lập dân tộc gắn liền với CNXH",
  questions: [
    // ═══════════════════════════════════════
    //  BUTTONS (8 câu)
    // ═══════════════════════════════════════
    {
      id: "btn-1",
      type: "buttons",
      prompt:
        "Vận dụng một cách sáng tạo lý luận cách mạng không ngừng của chủ nghĩa Mác - Lênin, trong Chánh cương vắn tắt của Đảng (năm 1930), Hồ Chí Minh đã khẳng định phương hướng chiến lược của cách mạng nước ta là gì?",
      durationSec: 20,
      maxScore: 1000,
      explanation:
        "Trang 114: \"...trong Chánh cương vắn tắt của Đảng (năm 1930), Hồ Chí Minh khẳng định phương hướng chiến lược của cách mạng nước ta là: 'làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản'\"",
      buttons: {
        options: [
          "Làm cách mạng dân tộc dân chủ nhân dân để tạo tiền đề đi tới chủ nghĩa cộng sản.",
          "Làm cách mạng giải phóng dân tộc làm cơ sở, tiền đề tiến thẳng lên chủ nghĩa xã hội.",
          "Làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản.",
          "Làm cách mạng vô sản để giành độc lập dân tộc và xây dựng chủ nghĩa xã hội.",
        ],
        correctIndex: 2,
      },
    },
    {
      id: "btn-2",
      type: "buttons",
      prompt:
        "Theo tư tưởng Hồ Chí Minh, độc lập dân tộc bao gồm cả nội dung dân tộc và dân chủ; độc lập phải gắn liền với thống nhất, chủ quyền, toàn vẹn lãnh thổ và yếu tố cốt lõi nào sau đây?",
      imageUrl: "/images/vui-choi-cung-tre-em.jpg",
      durationSec: 20,
      maxScore: 1000,
      explanation:
        'Tài liệu ghi rõ: "...hơn nữa độc lập dân tộc cũng phải gắn liền với tự do, cơm no, áo ấm, hạnh phúc cho nhân dân". Các đáp án A, C, D là những cụm từ "bẫy" mang hơi hướng lý luận chính trị nhưng không nằm trong định nghĩa trực tiếp.',
      buttons: {
        options: [
          "Xóa bỏ triệt để mọi tàn dư của chế độ phong kiến.",
          "Sự tự do, cơm no, áo ấm, hạnh phúc cho nhân dân.",
          "Sự bình đẳng và phát triển vượt bậc của kinh tế thị trường.",
          "Xây dựng một nền văn hóa tiên tiến, đậm đà bản sắc dân tộc.",
        ],
        correctIndex: 1,
      },
    },
    {
      id: "btn-3",
      type: "buttons",
      prompt:
        'Tư tưởng của Hồ Chí Minh về việc "độc lập dân tộc phải gắn liền với chủ nghĩa xã hội" là đúng đắn và sáng tạo vì nó đáp ứng yêu cầu cụ thể của cách mạng Việt Nam và đồng thời phù hợp với điều gì?',
      imageUrl: "/images/toa-nha.jpg",
      durationSec: 20,
      maxScore: 1000,
      explanation:
        'Trang 115 khẳng định tư tưởng trên là đúng đắn và sáng tạo vì "không chỉ đáp ứng được yêu cầu khách quan, cụ thể của cách mạng Việt Nam mà còn phù hợp với quy luật phát triển của thời đại".',
      buttons: {
        options: [
          "Quy luật phát triển của thời đại.",
          "Cương lĩnh của Quốc tế Cộng sản.",
          "Quy luật giá trị thặng dư của chủ nghĩa tư bản.",
          "Nguyện vọng của giai cấp tư sản dân tộc.",
        ],
        correctIndex: 0,
      },
    },
    {
      id: "btn-4",
      type: "buttons",
      prompt:
        'Năm 1960, Hồ Chí Minh đã khẳng định "chỉ có chủ nghĩa xã hội, chủ nghĩa cộng sản mới giải phóng được các dân tộc bị áp bức và..." đối tượng nào sau đây khỏi ách nô lệ?',
      imageUrl: "/images/dieu-hanh-hoi-xua.jpg",
      durationSec: 20,
      maxScore: 1000,
      explanation:
        'Theo đoạn trích năm 1960 của Hồ Chí Minh: "chỉ có chủ nghĩa xã hội, chủ nghĩa cộng sản mới giải phóng được các dân tộc bị áp bức và những người lao động trên thế giới khỏi ách nô lệ".',
      buttons: {
        options: [
          "Giai cấp nông dân nghèo ở các nước thuộc địa.",
          "Những người lao động trên thế giới.",
          "Các tầng lớp tri thức yêu nước.",
          "Toàn thể dân tộc Việt Nam.",
        ],
        correctIndex: 1,
      },
    },
    {
      id: "btn-5",
      type: "buttons",
      prompt:
        'Hồ Chí Minh mô tả chủ nghĩa xã hội là một xã hội công bằng và hợp lý với nguyên tắc "làm nhiều hưởng nhiều, làm ít hưởng ít, không làm không hưởng". Đi kèm với nguyên tắc này, Nhà nước phải bảo đảm điều kiện gì?',
      imageUrl: "/images/bac-nam-tay-tre-em.jpg",
      durationSec: 20,
      maxScore: 1000,
      explanation:
        'Tài liệu nêu rõ nguyên tắc phân phối này đi liền với yêu cầu: "bảo đảm phúc lợi xã hội cho người già, trẻ em và những người còn khó khăn trong cuộc sống".',
      buttons: {
        options: [
          "Phân phối của cải cào bằng cho tất cả các tầng lớp nhân dân.",
          "Cung cấp đất đai miễn phí cho mọi nông dân nghèo.",
          "Ưu tiên lợi ích kinh tế tuyệt đối cho giai cấp công nhân.",
          "Bảo đảm phúc lợi xã hội cho người già, trẻ em và những người còn khó khăn.",
        ],
        correctIndex: 3,
      },
    },
    {
      id: "btn-6",
      type: "buttons",
      prompt:
        "Đặc trưng về nền kinh tế của chủ nghĩa xã hội theo tư tưởng Hồ Chí Minh là một nền kinh tế phát triển cao, gắn liền với yếu tố nào để bảo đảm đời sống cho nhân dân?",
      imageUrl: "/images/ruong-lua.jpg",
      durationSec: 20,
      maxScore: 1000,
      explanation:
        'Chủ nghĩa xã hội ở Việt Nam "là một xã hội có nền kinh tế phát triển cao, gắn liền với sự phát triển của khoa học kỹ thuật, bảo đảm đời sống vật chất và tinh thần cho nhân dân...".',
      buttons: {
        options: [
          "Sự phát triển của các tập đoàn kinh tế tư nhân.",
          "Sự phát triển của khoa học kỹ thuật.",
          "Sự mở rộng thị trường xuất khẩu nông sản.",
          "Sự hỗ trợ tài chính từ các nước xã hội chủ nghĩa anh em.",
        ],
        correctIndex: 1,
      },
    },
    {
      id: "btn-7",
      type: "buttons",
      prompt:
        "Hồ Chí Minh cảnh báo rằng, trong quá trình tiến hành cách mạng, nếu Đảng đánh mất vai trò lãnh đạo tuyệt đối thì hậu quả đối với chủ nghĩa xã hội sẽ là gì?",
      imageUrl: "/images/co-dang-tung-bay.jpg",
      durationSec: 20,
      maxScore: 1000,
      explanation:
        'Nằm ở Điều kiện thứ nhất để bảo đảm độc lập dân tộc gắn liền với CNXH: "nếu không Đảng sẽ đánh mất vai trò lãnh đạo và chủ nghĩa xã hội sẽ sụp đổ, tan rã".',
      buttons: {
        options: [
          "Sẽ bị chệch hướng sang con đường tư bản chủ nghĩa.",
          "Sẽ sụp đổ, tan rã.",
          "Sẽ kéo dài thời kỳ quá độ lên chủ nghĩa xã hội.",
          "Sẽ mất đi sự ủng hộ của bạn bè quốc tế.",
        ],
        correctIndex: 1,
      },
    },
    {
      id: "btn-8",
      type: "buttons",
      prompt: 'Việc "xây dựng chủ nghĩa xã hội" theo Hồ Chí Minh có tác động gì đến nền "độc lập dân tộc"?',
      imageUrl: "/images/bo-doi-dieu-hanh.jpg",
      durationSec: 20,
      maxScore: 1000,
      explanation:
        'Tài liệu khẳng định: "Chủ nghĩa xã hội có khả năng làm cho đất nước phát triển mạnh mẽ, sẽ tạo nền tảng vững chắc để bảo vệ nền độc lập dân tộc..."',
      buttons: {
        options: [
          "Là cơ sở để tạm hoãn các cuộc chiến tranh giải phóng dân tộc.",
          "Là điều kiện để thay thế các giá trị truyền thống của dân tộc.",
          "Là khả năng tạo nền tảng vững chắc để bảo vệ nền độc lập dân tộc.",
          "Là mục tiêu để xóa bỏ ranh giới giữa các quốc gia, dân tộc ngay lập tức.",
        ],
        correctIndex: 2,
      },
    },

    // ═══════════════════════════════════════
    //  CHECKBOXES (7 câu)
    // ═══════════════════════════════════════
    {
      id: "chk-1",
      type: "checkboxes",
      prompt:
        "Những khẳng định nào sau đây là ĐÚNG khi nói về vị trí và vai trò của độc lập dân tộc theo tư tưởng Hồ Chí Minh?",
      imageUrl: "/images/lang-bac.jpg",
      durationSec: 25,
      maxScore: 1000,
      explanation:
        "Đáp án A, C, D đều đúng. B sai vì tài liệu ghi rõ: 'Khi đề cao mục tiêu độc lập dân tộc, Hồ Chí Minh không coi đó là mục tiêu cuối cùng của cách mạng, mà là tiền đề cho một cuộc cách mạng tiếp theo'.",
      checkboxes: {
        options: [
          "Giải phóng dân tộc, giành độc lập dân tộc là mục tiêu đầu tiên của cách mạng.",
          "Độc lập dân tộc là mục tiêu cuối cùng của cuộc cách mạng.",
          "Độc lập dân tộc là cơ sở, tiền đề cho mục tiêu tiếp theo là chủ nghĩa xã hội và chủ nghĩa cộng sản.",
          "Độc lập dân tộc không những là tiền đề mà còn là nguồn sức mạnh to lớn cho cách mạng xã hội chủ nghĩa.",
        ],
        correctIndexes: [0, 2, 3],
      },
    },
    {
      id: "chk-2",
      type: "checkboxes",
      prompt:
        "Theo tư tưởng Hồ Chí Minh, những nhận định nào sau đây là ĐÚNG khi bàn về bước chuyển từ cách mạng giải phóng dân tộc sang cách mạng xã hội chủ nghĩa?",
      imageUrl: "/images/dan-vo-tay.jpg",
      durationSec: 25,
      maxScore: 1000,
      explanation:
        'Tài liệu khẳng định Hồ Chí Minh "không coi đó là mục tiêu cuối cùng... mà là tiền đề cho một cuộc cách mạng tiếp theo". Đồng thời "cách mạng dân tộc dân chủ nhân dân càng sâu sắc... càng tạo ra những tiền đề thuận lợi, sức mạnh to lớn cho cách mạng xã hội chủ nghĩa". Đáp án B sai vì chúng gắn bó khăng khít với nhau.',
      checkboxes: {
        options: [
          "Độc lập dân tộc không phải là mục tiêu cuối cùng của cách mạng.",
          "Độc lập dân tộc và chủ nghĩa xã hội là hai giai đoạn hoàn toàn tách biệt, không tác động qua lại.",
          "Cách mạng dân tộc dân chủ nhân dân càng sâu sắc, triệt để thì càng tạo ra tiền đề thuận lợi cho cách mạng XHCN.",
          "Độc lập dân tộc là tiền đề, là nguồn sức mạnh to lớn cho cách mạng xã hội chủ nghĩa.",
        ],
        correctIndexes: [0, 2, 3],
      },
    },
    {
      id: "chk-3",
      type: "checkboxes",
      prompt:
        'Hồ Chí Minh đã nhận định thế nào về "chủ nghĩa xã hội ở Việt Nam" trong việc thiết lập một chế độ chính trị và pháp luật?',
      imageUrl: "/images/dieu-hanh.jpg",
      durationSec: 25,
      maxScore: 1000,
      explanation:
        '"Theo Hồ Chí Minh, chủ nghĩa xã hội ở Việt Nam trước hết là một chế độ dân chủ, do nhân dân làm chủ, dưới sự lãnh đạo của Đảng Cộng sản. Chế độ dân chủ thể hiện trong tất cả mọi mặt của đời sống xã hội và được thể chế hóa bằng pháp luật". Đáp án D sai.',
      checkboxes: {
        options: [
          "Trước hết đó là một chế độ dân chủ, do nhân dân làm chủ.",
          "Chế độ đó phải đặt dưới sự lãnh đạo của Đảng Cộng sản.",
          "Chế độ dân chủ được thể chế hóa bằng pháp luật.",
          "Đây là chế độ mà quyền lực nhà nước tập trung vào tay một nhóm tinh hoa tri thức độc lập.",
        ],
        correctIndexes: [0, 1, 2],
      },
    },
    {
      id: "chk-4",
      type: "checkboxes",
      prompt:
        "Những đặc trưng nào sau đây của chủ nghĩa xã hội (theo tư tưởng Hồ Chí Minh) giúp tạo nên nền tảng vững chắc cho đất nước?",
      imageUrl: "/images/bat-tay.jpg",
      durationSec: 25,
      maxScore: 1000,
      explanation:
        'Đoạn văn miêu tả CNXH: "...phát triển của khoa học kỹ thuật, bảo đảm đời sống vật chất và tinh thần cho nhân dân, là một xã hội có sự phát triển cao về đạo đức và văn hóa". Đáp án B sai vì văn bản ghi là "hòa bình hữu nghị, làm bạn với tất cả các nước dân chủ trên thế giới".',
      checkboxes: {
        options: [
          "Có nền kinh tế phát triển cao gắn với khoa học kỹ thuật.",
          "Chỉ thiết lập quan hệ hòa bình, hữu nghị độc quyền với các nước trong khối XHCN.",
          "Bảo đảm đời sống vật chất và tinh thần cho nhân dân.",
          "Là một xã hội có sự phát triển cao về đạo đức và văn hóa.",
        ],
        correctIndexes: [0, 2, 3],
      },
    },
    {
      id: "chk-5",
      type: "checkboxes",
      prompt:
        'Trong tiểu mục "Điều kiện để bảo đảm độc lập dân tộc gắn liền với chủ nghĩa xã hội", ba điều kiện mang tính nguyên tắc được Hồ Chí Minh đưa ra là gì?',
      imageUrl: "/images/thuyet-trinh.jpg",
      durationSec: 25,
      maxScore: 1000,
      explanation:
        'Theo giáo trình, 3 điều kiện được đánh số rõ ràng là: "Một là, phải bảo đảm vai trò lãnh đạo tuyệt đối của Đảng...", "Hai là, phải củng cố và tăng cường khối đại đoàn kết dân tộc...", và "Ba là, phải đoàn kết, gắn bó chặt chẽ với cách mạng thế giới". Đáp án B hoàn toàn bịa đặt.',
      checkboxes: {
        options: [
          "Phải bảo đảm vai trò lãnh đạo tuyệt đối của Đảng Cộng sản.",
          "Xây dựng nền kinh tế thị trường tự do định hướng tư bản để thu hút đầu tư trước mắt.",
          "Phải củng cố và tăng cường khối đại đoàn kết dân tộc (trên nền tảng liên minh công - nông).",
          "Phải đoàn kết, gắn bó chặt chẽ với cách mạng thế giới.",
        ],
        correctIndexes: [0, 2, 3],
      },
    },
    {
      id: "chk-6",
      type: "checkboxes",
      prompt:
        "Về khối đại đoàn kết toàn dân tộc (điều kiện thứ hai để bảo vệ độc lập và CNXH), Hồ Chí Minh đã có những quan điểm nào?",
      durationSec: 25,
      maxScore: 1000,
      explanation:
        'Tài liệu trích xuất chính xác: "...nền tảng là khối liên minh công - nông, vì theo Người, đại đoàn kết dân tộc là vấn đề có ý nghĩa chiến lược, quyết định sự thành công của cách mạng". Đáp án B sai vì đại đoàn kết có ý nghĩa chiến lược, không phải sách lược tạm thời.',
      checkboxes: {
        options: [
          "Nền tảng của khối đại đoàn kết này là khối liên minh công - nông.",
          "Đại đoàn kết dân tộc chỉ là sách lược tạm thời trong giai đoạn kháng chiến.",
          "Đại đoàn kết dân tộc là vấn đề có ý nghĩa chiến lược.",
          "Khối đại đoàn kết quyết định sự thành công của cách mạng.",
        ],
        correctIndexes: [0, 2, 3],
      },
    },
    {
      id: "chk-7",
      type: "checkboxes",
      prompt:
        'Việc thực hiện "đoàn kết quốc tế" (điều kiện thứ ba) theo Hồ Chí Minh hướng tới những mục đích to lớn nào?',
      imageUrl: "/images/chim-bay-tu-do.jpg",
      durationSec: 25,
      maxScore: 1000,
      explanation:
        '"Đoàn kết quốc tế, theo Hồ Chí Minh, là để tạo ra một sức mạnh to lớn cho cách mạng và cũng để góp phần chung cho nền hòa bình, độc lập, dân chủ và chủ nghĩa xã hội trên thế giới". Đáp án D sai hoàn toàn với tinh thần độc lập tự chủ của Hồ Chí Minh.',
      checkboxes: {
        options: [
          "Tạo ra một sức mạnh to lớn cho cách mạng Việt Nam.",
          "Góp phần chung cho nền hòa bình, độc lập, dân chủ trên thế giới.",
          "Đóng góp vào sự phát triển của chủ nghĩa xã hội trên thế giới.",
          "Đạt được mục tiêu lệ thuộc hoàn toàn vào các cường quốc quân sự để được bảo vệ.",
        ],
        correctIndexes: [0, 1, 2],
      },
    },

    // ═══════════════════════════════════════
    //  REORDER (8 câu)
    // ═══════════════════════════════════════
    {
      id: "reo-1",
      type: "reorder",
      prompt: "Sắp xếp đúng logic mối quan hệ giữa độc lập dân tộc và chủ nghĩa xã hội.",
      durationSec: 25,
      maxScore: 1000,
      reorder: {
        items: [
          "Bảo đảm nền độc lập bền vững",
          "Tiến lên chủ nghĩa xã hội",
          "Tạo tiền đề để xây dựng xã hội mới",
          "Giành độc lập dân tộc",
        ],
        correctOrder: [
          "Giành độc lập dân tộc",
          "Tạo tiền đề để xây dựng xã hội mới",
          "Tiến lên chủ nghĩa xã hội",
          "Bảo đảm nền độc lập bền vững",
        ],
      },
    },
    {
      id: "reo-2",
      type: "reorder",
      prompt: "Sắp xếp đúng các mục tiêu giải phóng trong tư tưởng Hồ Chí Minh.",
      durationSec: 20,
      maxScore: 1000,
      reorder: {
        items: ["Giải phóng con người", "Giải phóng dân tộc", "Giải phóng giai cấp"],
        correctOrder: ["Giải phóng dân tộc", "Giải phóng giai cấp", "Giải phóng con người"],
      },
    },
    {
      id: "reo-3",
      type: "reorder",
      prompt: 'Sắp xếp đúng trình tự nội dung "ham muốn tột bậc" của Hồ Chí Minh.',
      durationSec: 25,
      maxScore: 1000,
      reorder: {
        items: [
          "Ai cũng được học hành",
          "Nước ta được hoàn toàn độc lập",
          "Đồng bào ai cũng có cơm ăn áo mặc",
          "Dân ta được hoàn toàn tự do",
        ],
        correctOrder: [
          "Nước ta được hoàn toàn độc lập",
          "Dân ta được hoàn toàn tự do",
          "Đồng bào ai cũng có cơm ăn áo mặc",
          "Ai cũng được học hành",
        ],
      },
    },
    {
      id: "reo-4",
      type: "reorder",
      prompt: "Sắp xếp đúng tiến trình cách mạng theo tư tưởng Hồ Chí Minh.",
      durationSec: 25,
      maxScore: 1000,
      reorder: {
        items: ["Giành chính quyền", "Đánh đổ ách áp bức dân tộc", "Tiến lên chủ nghĩa xã hội", "Xây dựng chế độ mới"],
        correctOrder: [
          "Đánh đổ ách áp bức dân tộc",
          "Giành chính quyền",
          "Xây dựng chế độ mới",
          "Tiến lên chủ nghĩa xã hội",
        ],
      },
    },
    {
      id: "reo-5",
      type: "reorder",
      prompt: "Sắp xếp đúng các yếu tố thể hiện độc lập dân tộc có ý nghĩa thực chất.",
      durationSec: 25,
      maxScore: 1000,
      reorder: {
        items: [
          "Nhân dân được hạnh phúc",
          "Độc lập có ý nghĩa thật sự",
          "Có chủ quyền quốc gia",
          "Nhân dân được tự do",
        ],
        correctOrder: [
          "Có chủ quyền quốc gia",
          "Nhân dân được tự do",
          "Nhân dân được hạnh phúc",
          "Độc lập có ý nghĩa thật sự",
        ],
      },
    },
    {
      id: "reo-6",
      type: "reorder",
      prompt: "Sắp xếp đúng trình tự các mốc lịch sử gắn với tư tưởng độc lập dân tộc.",
      durationSec: 25,
      maxScore: 1000,
      reorder: {
        items: [
          "Tuyên ngôn Độc lập",
          "Đảng Cộng sản Việt Nam ra đời",
          "Hồ Chí Minh ra đi tìm đường cứu nước",
          '"Không có gì quý hơn độc lập, tự do"',
        ],
        correctOrder: [
          "Hồ Chí Minh ra đi tìm đường cứu nước",
          "Đảng Cộng sản Việt Nam ra đời",
          "Tuyên ngôn Độc lập",
          '"Không có gì quý hơn độc lập, tự do"',
        ],
      },
    },
    {
      id: "reo-7",
      type: "reorder",
      prompt: "Sắp xếp đúng lập luận về vai trò của chủ nghĩa xã hội.",
      durationSec: 25,
      maxScore: 1000,
      reorder: {
        items: [
          "Củng cố nền tảng chính trị",
          "Giữ vững nền độc lập dân tộc",
          "Nâng cao đời sống nhân dân",
          "Xây dựng nền tảng kinh tế",
        ],
        correctOrder: [
          "Xây dựng nền tảng kinh tế",
          "Củng cố nền tảng chính trị",
          "Nâng cao đời sống nhân dân",
          "Giữ vững nền độc lập dân tộc",
        ],
      },
    },
    {
      id: "reo-8",
      type: "reorder",
      prompt: "Sắp xếp đúng logic nhận thức của Hồ Chí Minh về mục tiêu cách mạng.",
      durationSec: 25,
      maxScore: 1000,
      reorder: {
        items: ["Tự do cho nhân dân", "Phát triển con người toàn diện", "Hạnh phúc cho nhân dân", "Độc lập dân tộc"],
        correctOrder: [
          "Độc lập dân tộc",
          "Tự do cho nhân dân",
          "Hạnh phúc cho nhân dân",
          "Phát triển con người toàn diện",
        ],
      },
    },

    // ═══════════════════════════════════════
    //  RANGE (7 câu)
    // ═══════════════════════════════════════
    {
      id: "rng-1",
      type: "range",
      prompt: "Hãy đoán năm Hồ Chí Minh đọc Tuyên ngôn Độc lập.",
      imageUrl: "/images/Bac-doc-tuyen-ngon-doc-lap.jpg",
      durationSec: 15,
      maxScore: 1000,
      range: {
        min: 1900,
        max: 2000,
        correctValue: 1945,
        unit: "năm",
        step: 1,
      },
    },
    {
      id: "rng-2",
      type: "range",
      prompt: "Hãy đoán năm Đảng Cộng sản Việt Nam ra đời.",
      imageUrl: "/images/co-dang.jpg",
      durationSec: 15,
      maxScore: 1000,
      range: {
        min: 1900,
        max: 2000,
        correctValue: 1930,
        unit: "năm",
        step: 1,
      },
    },
    {
      id: "rng-3",
      type: "range",
      prompt: "Hãy đoán năm Hồ Chí Minh ra đi tìm đường cứu nước.",
      imageUrl: "/images/ben-nha-rong.jpg",
      durationSec: 15,
      maxScore: 1000,
      range: {
        min: 1900,
        max: 2000,
        correctValue: 1911,
        unit: "năm",
        step: 1,
      },
    },
    {
      id: "rng-4",
      type: "range",
      prompt: 'Câu "Không có gì quý hơn độc lập, tự do" được nêu vào năm nào?',
      imageUrl: "/images/chan-dung-Ho-Chi-Minh.jpg",
      durationSec: 15,
      maxScore: 1000,
      range: {
        min: 1900,
        max: 2000,
        correctValue: 1966,
        unit: "năm",
        step: 1,
      },
    },
    {
      id: "rng-5",
      type: "range",
      prompt: "Theo em, từ khi Đảng Cộng sản Việt Nam ra đời đến khi Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập là bao nhiêu năm ?",
      durationSec: 15,
      maxScore: 1000,
      range: {
        min: 0,
        max: 50,
        correctValue: 15,
        unit: "năm",
        step: 1,
      },
    },
    {
      id: "rng-6",
      type: "range",
      prompt: "Từ năm 1945 đến năm 1966 là bao nhiêu năm?",
      durationSec: 15,
      maxScore: 1000,
      range: {
        min: 0,
        max: 50,
        correctValue: 21,
        unit: "năm",
        step: 1,
      },
    },
    {
      id: "rng-7",
      type: "range",
      prompt: "Quốc khánh Việt Nam là ngày mấy trong tháng 9?",
      imageUrl: "/images/le-dai-Ba-Dinh.jpg",
      durationSec: 15,
      maxScore: 1000,
      range: {
        min: 1,
        max: 30,
        correctValue: 2,
        unit: "",
        step: 1,
      },
    },
  ],
  createdAt: Date.now(),
};
