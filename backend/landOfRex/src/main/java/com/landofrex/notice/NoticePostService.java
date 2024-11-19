package com.landofrex.notice;

import com.landofrex.notice.controller.NoticePostSimpleResponse;
import com.landofrex.post.controller.PostCreateRequest;
import com.landofrex.user.entity.User;
import com.landofrex.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class NoticePostService {
    private final NoticePostRepository noticePostRepository;
    private final UserRepository userRepository;

    @Transactional
    public NoticePost createNotice(Long userId, PostCreateRequest postCreateRequest) {
        User user=userRepository.findById(userId).orElseThrow(NoSuchElementException::new);
        NoticePost notice=new NoticePost(postCreateRequest,user);
        return noticePostRepository.save(notice);
    }

    public NoticePostDto.PageResponse getAllNotices(Pageable pageable) {
        Page<NoticePost> noticePage = noticePostRepository.findAll(pageable);
        return new NoticePostDto.PageResponse(noticePage);
    }

    public NoticePostDto.DetailResponse getNoticeById(Long noticeId) {
        NoticePost notice = noticePostRepository.findById(noticeId)
                .orElseThrow(NoSuchElementException::new);
        return new NoticePostDto.DetailResponse(notice);
    }

    @Transactional
    public void deleteNotice(Long noticeId) {
        noticePostRepository.deleteById(noticeId);
    }

}
