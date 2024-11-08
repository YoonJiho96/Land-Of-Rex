package com.landofrex.post;

import com.landofrex.post.entity.GeneralPost;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneralPostRepository extends JpaRepository<GeneralPost, Long> {
}
