<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="cooks")
 */
class Cook
{
    const SEX_DEFAULT= '-- Не выбрано --',
        SEX_MALE   = 'Мужской',
        SEX_FEMALE = 'Женский';

    const MARITAL_DEFAULT   = '-- Не выбрано --',
        MARITAL_MARRIED   = 'Женат / Замужем',
        MARITAL_ENGAGED   = 'Помовлен(а)',
        MARITAL_DIVORCED  = 'Разведен(а)',
        MARITAL_LOVE      = 'Влюблен(а)',
        MARITAL_PENDING   = 'В ожидании',
        MARITAL_ASCETIC   = 'Аскет / Монах';

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\User")
     * @ORM\JoinColumn(name="id", referencedColumnName="id")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=50, nullable=false)
     */
    protected $first_name;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    protected $last_name;

    /**
     * @ORM\Column(type="string", length=70, nullable=true)
     */
    protected $family;

    /**
     * @ORM\Column(type="string", length=70, nullable=true)
     */
    protected $patronymic;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    protected $birthday;

    /**
     * @ORM\Column(type="string", columnDefinition="CHAR(2) NULL")
     */
    protected $sex;

    /**
     * @ORM\Column(type="string", columnDefinition="CHAR(2) NULL")
     */
    protected $marital_status;

    /**
     * @Assert\Length(
     *      min = 5,
     *      max = 20000,
     *      minMessage = "Минимальное колличество символов описания, должно быть больше чем {{ limit }}.",
     *      maxMessage = "Максимальное колличество символов для описания не должно превышать {{ limit }}."
     * )
     * @ORM\Column(type="text", nullable=true)
     */
    protected $about;

    /**
     * @return array
     */
    public static function getSexesList()
    {
        return [
            self::SEX_DEFAULT   => 0,
            self::SEX_MALE      => 1,
            self::SEX_FEMALE    => 2,
        ];
    }

    /**
     * @return array
     */
    public static function getMaritalLists()
    {
        return [
            self::MARITAL_DEFAULT   => 0,
            self::MARITAL_MARRIED   => 1,
            self::MARITAL_ENGAGED   => 2,
            self::MARITAL_DIVORCED  => 3,
            self::MARITAL_LOVE      => 4,
            self::MARITAL_PENDING   => 5,
            self::MARITAL_ASCETIC   => 6,
        ];
    }

    /**
     * Set id
     *
     * @param integer $id
     *
     * @return Cook
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set firstName
     *
     * @param string $firstName
     *
     * @return Cook
     */
    public function setFirstName($firstName)
    {
        $this->first_name = $firstName;

        return $this;
    }

    /**
     * Get firstName
     *
     * @return string
     */
    public function getFirstName()
    {
        return $this->first_name;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     *
     * @return Cook
     */
    public function setLastName($lastName)
    {
        $this->last_name = $lastName;

        return $this;
    }

    /**
     * Get lastName
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->last_name;
    }

    /**
     * Set family
     *
     * @param string $family
     *
     * @return Cook
     */
    public function setFamily($family)
    {
        $this->family = $family;

        return $this;
    }

    /**
     * Get family
     *
     * @return string
     */
    public function getFamily()
    {
        return $this->family;
    }

    /**
     * Set patronymic
     *
     * @param string $patronymic
     *
     * @return Cook
     */
    public function setPatronymic($patronymic)
    {
        $this->patronymic = $patronymic;

        return $this;
    }

    /**
     * Get patronymic
     *
     * @return string
     */
    public function getPatronymic()
    {
        return $this->patronymic;
    }

    /**
     * Set birthday
     *
     * @param \DateTime $birthday
     *
     * @return Cook
     */
    public function setBirthday($birthday)
    {
        $this->birthday = $birthday;

        return $this;
    }

    /**
     * Get birthday
     *
     * @return \DateTime
     */
    public function getBirthday()
    {
        return $this->birthday;
    }

    /**
     * Set sex
     *
     * @param string $sex
     *
     * @return Cook
     */
    public function setSex($sex)
    {
        $this->sex = $sex;

        return $this;
    }

    /**
     * Get sex
     *
     * @return string
     */
    public function getSex()
    {
        return $this->sex;
    }

    /**
     * Set maritalStatus
     *
     * @param string $maritalStatus
     *
     * @return Cook
     */
    public function setMaritalStatus($maritalStatus)
    {
        $this->marital_status = $maritalStatus;

        return $this;
    }

    /**
     * Get maritalStatus
     *
     * @return string
     */
    public function getMaritalStatus()
    {
        return $this->marital_status;
    }

    /**
     * Set about
     *
     * @param string $about
     *
     * @return Cook
     */
    public function setAbout($about)
    {
        $this->about = $about;

        return $this;
    }

    /**
     * Get about
     *
     * @return string
     */
    public function getAbout()
    {
        return $this->about;
    }
}
