package com.gwsystems.misc;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import nl.captcha.Captcha.Builder;
import nl.captcha.gimpy.GimpyRenderer;
import nl.captcha.servlet.CaptchaServletUtil;
import nl.captcha.servlet.SimpleCaptchaServlet;

public class Captcha extends SimpleCaptchaServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8843355878605863899L;
	public static String NAME = "gwscapsess";

	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		HttpSession session = req.getSession();
		nl.captcha.Captcha captcha;
		_width = 460;
		_height = 70;
		Builder builder = new nl.captcha.Captcha.Builder(_width, _height);
		builder.addText();
		builder.gimp();
		builder.addNoise();
		builder.gimp(new FishEyeGimpy());
		captcha = builder.build();

		session.setAttribute(NAME, captcha);
		CaptchaServletUtil.writeImage(resp, captcha.getImage());

		return;
	}
}

class FishEyeGimpy implements GimpyRenderer {

	public void gimp(BufferedImage image) {
		int height = image.getHeight();
		int width = image.getWidth();

		Graphics2D graph = (Graphics2D) image.getGraphics();

		int pix[] = new int[height * width];
		int j = 0;

		for (int j1 = 0; j1 < width; j1++) {
			for (int k1 = 0; k1 < height; k1++) {
				pix[j] = image.getRGB(j1, k1);
				j++;
			}
		}

		double distance = ranInt(width / 4, width / 3);

		// put the distortion in the (dead) middle
		int wMid = image.getWidth() / 2;
		int hMid = image.getHeight() / 2;

		// again iterate over all pixels..
		for (int x = 0; x < image.getWidth(); x++) {
			for (int y = 0; y < image.getHeight(); y++) {

				int relX = x - wMid;
				int relY = y - hMid;

				double d1 = Math.sqrt(relX * relX + relY * relY);
				if (d1 < distance) {

					int j2 = wMid
							+ (int) (((fishEyeFormula(d1 / distance) * distance) / d1) * (x - wMid));
					int k2 = hMid
							+ (int) (((fishEyeFormula(d1 / distance) * distance) / d1) * (y - hMid));
					image.setRGB(x, y, pix[j2 * height + k2]);
				}
			}
		}

		graph.dispose();
	}

	private final int ranInt(int i, int j) {
		double d = Math.random();
		return (int) (i + ((j - i) + 1) * d);
	}

	private final double fishEyeFormula(double s) {
		// implementation of:
		// g(s) = - (3/4)s3 + (3/2)s2 + (1/4)s, with s from 0 to 1.
		if (s < 0.0D) {
			return 0.0D;
		}
		if (s > 1.0D) {
			return s;
		}

		return -0.75D * s * s * s + 1.5D * s * s + 0.25D * s;
	}
}
