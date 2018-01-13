package com.gwsystems.misc;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigReader {

	public static String read( String key ) {
		try {
			InputStream is = ConfigReader.class.getResourceAsStream( "/config.properties" );
			Properties props = new Properties();
			props.load( is );
			return props.getProperty( key );
		} catch (SecurityException e) {
			return null;
		} catch (IOException e) {
			return null;
		}
	}
}
