package kr.co.iQratorPlus.database.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/***************************************************
* This software is the proprietary information of IRSSOFTKOREA
*
* Revision History
* Author             Date       Description
* ------------------ ---------- -----------------------
* KimHyeongseok      2023. 04. 19.	HikariCp 사용하여 다중 DB사용 셋팅 첫번째 db
*
****************************************************/

@Configuration
@MapperScan(value = "kr.co.iQratorPlus.database.mapper", sqlSessionFactoryRef = "db1SqlSessionFactory")
public class Hikari1DataBaseConfig {
	
    @Bean
    @Primary
    @Qualifier("db1HikariConfig")
	@ConfigurationProperties(prefix = "spring.datasource1.hikari")
	public HikariConfig db1HikariConfig() {
		return new HikariConfig();
	}
	
	@Bean(name = "db1DataSource")
	@Primary	
	public DataSource dataSource() {
		return new HikariDataSource(db1HikariConfig());
	}
	
	@Bean(name = "db1SqlSessionFactory")	
	@Primary	
	public SqlSessionFactory sqlSessionFactory(@Qualifier("db1DataSource") DataSource dataSource) throws Exception{
		final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
		sessionFactory.setDataSource(dataSource);
		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		sessionFactory.setMapperLocations(resolver.getResources("classpath:mybatis/db1/*/*.xml")); 	   //mapper 파일 로드
		sessionFactory.setConfigLocation(resolver.getResource("classpath:mybatis/mybatis-config.xml"));//mybatis-config 로드
		return sessionFactory.getObject();
	}
	
	@Bean(name = "db1SqlSessionTemplate")
	@Primary
	public SqlSessionTemplate sqlSessionTemplate(@Qualifier("db1SqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception{
		final SqlSessionTemplate sqlSessionTemplate = new SqlSessionTemplate(sqlSessionFactory);
		return sqlSessionTemplate;
	}
}
