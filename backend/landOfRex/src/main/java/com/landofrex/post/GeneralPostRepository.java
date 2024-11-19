package com.landofrex.post;

import com.landofrex.post.entity.GeneralPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GeneralPostRepository extends JpaRepository<GeneralPost, Long> {
    public Page<GeneralPost> findByAuthor_Id(Long authorId, Pageable pageable);
}
