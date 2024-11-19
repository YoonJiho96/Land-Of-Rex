package com.landofrex.aws.launcher;

import com.landofrex.response.SuccessResponse;
import com.sun.net.httpserver.Authenticator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/launcher")
@RequiredArgsConstructor
public class LauncherS3Controller {
    private final LauncherS3Service launcherS3Service;
    private final String objectKey="Land-Of-Rex-Setup.exe";

    @GetMapping("/url")
    @ResponseStatus(HttpStatus.OK)
    public SuccessResponse<String> getPresignedurl() {
        return SuccessResponse.of(launcherS3Service.generateSignedUrl(objectKey));
    }

}