package com.landofrex.image;

import com.landofrex.image.entity.PostImage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends CrudRepository<PostImage, Long> {
}
