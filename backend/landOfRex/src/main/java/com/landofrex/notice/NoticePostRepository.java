package com.landofrex.notice;

import org.owasp.shim.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticePostRepository extends JpaRepository<NoticePost, Long> {
}
