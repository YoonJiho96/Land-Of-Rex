package com.landofrex.security.sanitizer;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Service;

@Service
public class HtmlSanitizerService {

    private final PolicyFactory policy;

    public HtmlSanitizerService() {
        // 기본(BASIC) 정책 설정
        policy = new HtmlPolicyBuilder()
                .allowElements(
                        "b", "i", "u", "strong", "em",  // 기본 텍스트 포맷팅
                        "p", "div", "span", "br",       // 기본 블록/인라인 요소
                        "ul", "ol", "li"                // 리스트
                )
                .allowCommonInlineFormattingElements()
                .allowCommonBlockElements()
                .toFactory();
    }

    public String sanitize(String html) {
        if (html == null) {
            return "";
        }
        return policy.sanitize(html);
    }

    // 이미지도 허용하는 정책
    public String sanitizeWithImages(String html) {
        PolicyFactory imagePolicy = new HtmlPolicyBuilder()
                .allowElements(
                        "b", "i", "u", "strong", "em",  // 기본 요소들
                        "p", "div", "span", "br",
                        "ul", "ol", "li",
                        "img"                           // 이미지 추가
                )
                .allowCommonInlineFormattingElements()
                .allowCommonBlockElements()
                .allowAttributes("src", "alt", "width", "height")
                .onElements("img")
                .allowUrlProtocols("https")
                .toFactory();

        return imagePolicy.sanitize(html);
    }
}

